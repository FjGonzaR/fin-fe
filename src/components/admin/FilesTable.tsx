import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Play, RotateCcw, Trash2, Eye, Loader2 } from "lucide-react"
import { getFileUrl } from "@/api/endpoints"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { FileMetadata } from "@/types/api"

interface FilesTableProps {
  files: FileMetadata[] | undefined
  isLoading: boolean
  onTriggerEtl: (fileId: string) => void
  onResetEtl: (fileId: string) => void
  onDeleteFile: (fileId: string) => void
  pendingFileId: string | null
}

const STATUS_STYLES: Record<string, string> = {
  PROCESSED: "bg-green-100 text-green-700 border-green-200",
  FAILED: "bg-red-100 text-red-700 border-red-200",
  PARSING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  UPLOADED: "bg-gray-100 text-gray-600 border-gray-200",
}

const STATUS_LABELS: Record<string, string> = {
  PROCESSED: "Procesado",
  FAILED: "Error",
  PARSING: "Procesando…",
  UPLOADED: "Subido",
}

const FALLBACK_STYLE = "bg-gray-100 text-gray-500 border-gray-200"

function normalizeStatus(status: string): string {
  return status?.toUpperCase() ?? "PENDING"
}

// Action permissions per status
function canPlay(status: string): boolean {
  return status === "UPLOADED" || status === "FAILED"
}
function canReset(status: string): boolean {
  return status === "PROCESSED"
}
function canDelete(status: string): boolean {
  return status !== "PARSING"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str
}

export function FilesTable({
  files,
  isLoading,
  onTriggerEtl,
  onResetEtl,
  onDeleteFile,
  pendingFileId,
}: FilesTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<FileMetadata | null>(null)
  const [confirmReset, setConfirmReset] = useState<FileMetadata | null>(null)
  const [openingFileId, setOpeningFileId] = useState<string | null>(null)

  const fileUrlMutation = useMutation({
    mutationFn: (fileId: string) => getFileUrl(fileId),
    onSuccess: (data) => {
      window.open(data.url, "_blank", "noopener,noreferrer")
      setOpeningFileId(null)
    },
    onError: () => setOpeningFileId(null),
  })

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-64">Archivo</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right pr-4">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && (!files || files.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-gray-400 py-8">
                  No hay archivos subidos aún.
                </TableCell>
              </TableRow>
            )}

            {files?.map((file) => {
              const isMutating = pendingFileId === file.file_id
              const status = normalizeStatus(file.status)
              const playAllowed = canPlay(status) && !isMutating
              const resetAllowed = canReset(status) && !isMutating
              const deleteAllowed = canDelete(status) && !isMutating

              return (
                <TableRow key={file.file_id} className="hover:bg-gray-50">
                  <TableCell>
                    <span className="font-mono text-xs text-gray-800" title={file.filename}>
                      {truncate(file.filename, 32)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{file.account_name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? FALLBACK_STYLE}`}
                    >
                      {status === "PARSING" && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      {STATUS_LABELS[status] ?? status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {formatDate(file.uploaded_at)}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title={status !== "PROCESSED" ? "Solo disponible para archivos procesados" : "Abrir archivo"}
                        disabled={status !== "PROCESSED" || openingFileId === file.file_id}
                        onClick={() => {
                          setOpeningFileId(file.file_id)
                          fileUrlMutation.mutate(file.file_id)
                        }}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {openingFileId === file.file_id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Eye className="h-4 w-4" />
                        }
                      </button>
                      <button
                        title={
                          status === "PROCESSED"
                            ? "Ya procesado — usa Resetear para reprocesar"
                            : status === "PARSING"
                              ? "Procesando…"
                              : status === "FAILED"
                                ? "Reintentar ETL"
                                : "Procesar ETL"
                        }
                        disabled={!playAllowed}
                        onClick={() => onTriggerEtl(file.file_id)}
                        className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isMutating && canPlay(status) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        title={
                          !resetAllowed && status !== "PROCESSING"
                            ? "Solo disponible para archivos procesados"
                            : "Resetear ETL y eliminar transacciones"
                        }
                        disabled={!resetAllowed}
                        onClick={() => setConfirmReset(file)}
                        className="rounded p-1.5 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        title={
                          status === "PROCESSING"
                            ? "No se puede eliminar mientras se procesa"
                            : "Eliminar archivo"
                        }
                        disabled={!deleteAllowed}
                        onClick={() => setConfirmDelete(file)}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!confirmReset} onOpenChange={(open) => { if (!open) setConfirmReset(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Resetear ETL?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Se eliminarán todas las transacciones de{" "}
            <span className="font-medium">{confirmReset?.filename}</span> y el archivo
            volverá a estado PENDING.
          </p>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setConfirmReset(null)}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (confirmReset) onResetEtl(confirmReset.file_id)
                setConfirmReset(null)
              }}
              className="rounded-lg bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-600"
            >
              Resetear
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDelete} onOpenChange={(open) => { if (!open) setConfirmDelete(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar archivo?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Se eliminará <span className="font-medium">{confirmDelete?.filename}</span> del
            almacenamiento. Si tiene transacciones asociadas, primero debes resetear el ETL.
          </p>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setConfirmDelete(null)}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (confirmDelete) onDeleteFile(confirmDelete.file_id)
                setConfirmDelete(null)
              }}
              className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
