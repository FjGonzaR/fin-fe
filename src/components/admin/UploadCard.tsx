import { useRef, useState } from "react"
import { UploadCloud, FileText, Play, Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAccounts } from "@/hooks/useAccounts"
import { useUploadFile } from "@/hooks/useUploadFile"
import { useTriggerEtl } from "@/hooks/useTriggerEtl"
import { cn } from "@/lib/utils"
import type { EtlStatusResponse, UploadResponse } from "@/types/api"

function resolveFileId(data: UploadResponse): string {
  const id = data.file_id ?? data.id
  if (!id) throw new Error("El servidor no devolvió el ID del archivo. Revisa la respuesta del backend.")
  return id
}

type Step =
  | { id: "idle" }
  | { id: "uploading" }
  | { id: "uploaded"; data: UploadResponse }
  | { id: "processing"; data: UploadResponse }
  | { id: "done"; filename: string; result: EtlStatusResponse }
  | { id: "error"; filename: string; message: string; fileId: string }

export function UploadCard() {
  const [file, setFile] = useState<File | null>(null)
  const [accountId, setAccountId] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [step, setStep] = useState<Step>({ id: "idle" })
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: accounts } = useAccounts()
  const uploadMutation = useUploadFile()
  const etlMutation = useTriggerEtl()

  function resetToIdle() {
    setStep({ id: "idle" })
    setFile(null)
    setAccountId("")
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  function handleUpload() {
    if (!file || !accountId) return
    setStep({ id: "uploading" })
    uploadMutation.mutate(
      { file, accountId },
      {
        onSuccess: (data) => {
          setStep({ id: "uploaded", data })
          setFile(null)
          setAccountId("")
          if (inputRef.current) inputRef.current.value = ""
        },
        onError: (err) => {
          setStep({ id: "error", filename: file.name, message: err.message, fileId: "" })
        },
      },
    )
  }

  function handleTriggerEtl(uploadData: UploadResponse) {
    let fileId: string
    try {
      fileId = resolveFileId(uploadData)
    } catch (e) {
      setStep({ id: "error", filename: uploadData.original_filename, message: (e as Error).message, fileId: "" })
      return
    }
    setStep({ id: "processing", data: uploadData })
    etlMutation.mutate(fileId, {
      onSuccess: (result) => {
        setStep({ id: "done", filename: uploadData.original_filename, result })
      },
      onError: (err) => {
        setStep({
          id: "error",
          filename: uploadData.original_filename,
          message: err.message,
          fileId: uploadData.file_id,
        })
      },
    })
  }

  function handleRetryEtl(fileId: string, filename: string) {
    setStep({ id: "processing", data: { id: fileId, original_filename: filename, parse_status: "", file_hash: "", uploaded_at: "" } })
    etlMutation.mutate(fileId, {
      onSuccess: (result) => setStep({ id: "done", filename, result }),
      onError: (err) => setStep({ id: "error", filename, message: err.message, fileId }),
    })
  }

  const canUpload = !!file && !!accountId && step.id === "idle"

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-800">Subir Archivo</h3>

      {/* ── IDLE / UPLOADING ── */}
      {(step.id === "idle" || step.id === "uploading") && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => step.id === "idle" && inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors",
              step.id === "uploading"
                ? "border-gray-300 bg-gray-50 cursor-default"
                : isDragging
                  ? "border-gray-400 bg-gray-100"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100",
            )}
          >
            {step.id === "uploading" ? (
              <>
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <p className="text-sm text-gray-500">Subiendo archivo…</p>
              </>
            ) : file ? (
              <>
                <FileText className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-500">
                  Arrastra un archivo <span className="font-medium">.xlsx</span> o{" "}
                  <span className="font-medium">.pdf</span>, o haz clic aquí
                </p>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex items-center gap-3">
            <Select value={accountId} onValueChange={setAccountId} disabled={step.id === "uploading"}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar cuenta…" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.account_name} · {acc.bank_name} ({acc.owner})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step.id === "uploading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              Subir
            </button>
          </div>
        </div>
      )}

      {/* ── UPLOADED — ready to process ── */}
      {step.id === "uploaded" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-900">Archivo subido correctamente</p>
              <p className="text-xs text-blue-700 truncate mt-0.5">{step.data.original_filename}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 space-y-3">
            <p className="text-xs text-gray-500">
              El archivo está listo para ser procesado. El ETL parseará las transacciones y las
              importará a la base de datos.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTriggerEtl(step.data)}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                <Play className="h-4 w-4" />
                Procesar ETL
              </button>
              <button
                onClick={resetToIdle}
                className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROCESSING ── */}
      {step.id === "processing" && (
        <div className="flex items-center gap-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-4">
          <Loader2 className="h-6 w-6 text-yellow-600 animate-spin shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-900">Procesando ETL…</p>
            <p className="text-xs text-yellow-700 mt-0.5 truncate">{step.data.original_filename}</p>
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {step.id === "done" && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-900">
                {step.result.status === "ALREADY_PROCESSED"
                  ? "Archivo ya estaba procesado"
                  : "ETL completado correctamente"}
              </p>
              <p className="text-xs text-green-700 truncate mt-0.5">{step.filename}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center">
              <p className="text-lg font-bold text-gray-900">{step.result.parsed_rows}</p>
              <p className="text-xs text-gray-500">Filas leídas</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center">
              <p className="text-lg font-bold text-green-700">{step.result.inserted_transactions}</p>
              <p className="text-xs text-gray-500">Transacciones</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center">
              <p className="text-lg font-bold text-gray-400">{step.result.duplicates_skipped}</p>
              <p className="text-xs text-gray-500">Duplicados</p>
            </div>
          </div>

          <button
            onClick={resetToIdle}
            className="w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Subir otro archivo
          </button>
        </div>
      )}

      {/* ── ERROR ── */}
      {step.id === "error" && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-900">Error en el procesamiento</p>
              <p className="text-xs text-red-700 mt-0.5 truncate">{step.filename}</p>
              <p className="text-xs text-red-600 mt-1 break-words">{step.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step.fileId && (
              <button
                onClick={() => handleRetryEtl(step.fileId, step.filename)}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reintentar ETL
              </button>
            )}
            <button
              onClick={resetToIdle}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Subir otro archivo
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
