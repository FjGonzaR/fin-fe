import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { useFiles } from "@/hooks/useFiles"
import { useTriggerEtl } from "@/hooks/useTriggerEtl"
import { useResetEtl } from "@/hooks/useResetEtl"
import { useDeleteFile } from "@/hooks/useDeleteFile"
import { UploadCard } from "./UploadCard"
import { FilesTable } from "./FilesTable"

export function FilesTab() {
  const { data: files, isLoading, isError, error, refetch } = useFiles()
  const triggerEtl = useTriggerEtl()
  const resetEtl = useResetEtl()
  const deleteFile = useDeleteFile()
  const [pendingFileId, setPendingFileId] = useState<string | null>(null)

  function handleTriggerEtl(fileId: string) {
    setPendingFileId(fileId)
    triggerEtl.mutate(fileId, { onSettled: () => setPendingFileId(null) })
  }

  function handleResetEtl(fileId: string) {
    setPendingFileId(fileId)
    resetEtl.mutate(fileId, { onSettled: () => setPendingFileId(null) })
  }

  function handleDeleteFile(fileId: string) {
    setPendingFileId(fileId)
    deleteFile.mutate(fileId, { onSettled: () => setPendingFileId(null) })
  }

  return (
    <div className="space-y-5">
      <UploadCard />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Archivos Subidos</h3>
          <button
            onClick={() => void refetch()}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Actualizar
          </button>
        </div>
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error al cargar archivos: {error instanceof Error ? error.message : "Error desconocido"}.{" "}
            <button onClick={() => void refetch()} className="font-medium underline">
              Reintentar
            </button>
          </div>
        )}
        {!isError && (
          <FilesTable
            files={files}
            isLoading={isLoading}
            onTriggerEtl={handleTriggerEtl}
            onResetEtl={handleResetEtl}
            onDeleteFile={handleDeleteFile}
            pendingFileId={pendingFileId}
          />
        )}
      </div>
    </div>
  )
}
