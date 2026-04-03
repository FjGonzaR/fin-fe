import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useFilePreview } from "@/hooks/useFilePreview"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

interface FilePreviewDialogProps {
  fileId: string | null
  filename?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilePreviewDialog({
  fileId,
  filename,
  open,
  onOpenChange,
}: FilePreviewDialogProps) {
  const { data, isLoading, error } = useFilePreview(open ? fileId : null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Vista previa — {filename ?? fileId}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 py-4">
              Error al cargar la vista previa: {error.message}
            </p>
          )}

          {data && (
            <>
              <p className="text-xs text-gray-400 mb-3">
                Mostrando {data.rows.length} de {data.total_rows} filas
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {data.columns.map((col) => (
                        <th
                          key={col}
                          className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap border-b border-gray-200"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        {data.columns.map((col) => (
                          <td
                            key={col}
                            className="px-3 py-1.5 text-gray-700 whitespace-nowrap"
                          >
                            {row[col] !== null && row[col] !== undefined
                              ? String(row[col])
                              : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
