import { useRef, useState } from "react"
import { UploadCloud, FileText, Play, Loader2 } from "lucide-react"
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
import type { UploadResponse } from "@/types/api"

export function UploadCard() {
  const [file, setFile] = useState<File | null>(null)
  const [accountId, setAccountId] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [uploaded, setUploaded] = useState<UploadResponse | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: accounts } = useAccounts()
  const uploadMutation = useUploadFile()
  const etlMutation = useTriggerEtl()

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
    setUploadError(null)
    uploadMutation.mutate(
      { file, accountId },
      {
        onSuccess: (data) => {
          setUploaded(data)
          setFile(null)
          setAccountId("")
          if (inputRef.current) inputRef.current.value = ""
        },
        onError: (err) => setUploadError(err.message),
      },
    )
  }

  function handleTriggerEtl() {
    if (!uploaded) return
    etlMutation.mutate(uploaded.file_id, {
      onSuccess: () => setUploaded(null),
    })
  }

  const canUpload = !!file && !!accountId && !uploadMutation.isPending

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-800">Subir Archivo</h3>

      {!uploaded ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors",
              isDragging
                ? "border-gray-400 bg-gray-100"
                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100",
            )}
          >
            {file ? (
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
            <Select value={accountId} onValueChange={setAccountId}>
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
              {uploadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              Subir
            </button>
          </div>

          {uploadError && (
            <p className="text-xs text-red-500">{uploadError}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
          <FileText className="h-5 w-5 text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 truncate">{uploaded.original_filename}</p>
            <p className="text-xs text-green-600">Subido correctamente</p>
          </div>
          <button
            onClick={handleTriggerEtl}
            disabled={etlMutation.isPending}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 shrink-0"
          >
            {etlMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Procesar ETL
          </button>
          <button
            onClick={() => setUploaded(null)}
            className="text-xs text-green-600 hover:underline shrink-0"
          >
            Subir otro
          </button>
        </div>
      )}
    </Card>
  )
}
