import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDeleteCategory } from "@/hooks/useDeleteCategory"
import type { Category } from "@/types/api"

interface Props {
  category: Category | null
  allCategories: Category[]
  onClose: () => void
}

export function CategoryDeleteDialog({ category, allCategories, onClose }: Props) {
  const del = useDeleteCategory()
  const [reassignTo, setReassignTo] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [needsReassign, setNeedsReassign] = useState(false)

  useEffect(() => {
    if (category) {
      setReassignTo("")
      setError(null)
      setNeedsReassign(false)
    }
  }, [category])

  if (!category) return null

  const isSystem = category.is_system
  const others = allCategories.filter((c) => c.id !== category.id && c.is_active)

  function handleDelete() {
    if (!category) return
    setError(null)
    del.mutate(
      { id: category.id, reassignTo: needsReassign ? reassignTo : undefined },
      {
        onSuccess: () => onClose(),
        onError: (err) => {
          const msg = err.message
          if (/reassign/i.test(msg) || /transac/i.test(msg)) {
            setNeedsReassign(true)
          }
          setError(msg)
        },
      },
    )
  }

  return (
    <Dialog open={!!category} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>¿Eliminar categoría?</DialogTitle>
        </DialogHeader>

        {isSystem ? (
          <p className="text-sm text-gray-600">
            <span className="font-medium">{category.name}</span> es una categoría del sistema y no
            puede ser eliminada.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Se eliminará <span className="font-medium">{category.name}</span>.
              {needsReassign &&
                " Tiene transacciones asociadas — escogé una categoría destino para reasignarlas."}
            </p>

            {needsReassign && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Reasignar transacciones a
                </label>
                <Select value={reassignTo} onValueChange={setReassignTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría destino…" />
                  </SelectTrigger>
                  <SelectContent>
                    {others.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
          </>
        )}

        <DialogFooter className="gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          {!isSystem && (
            <button
              onClick={handleDelete}
              disabled={del.isPending || (needsReassign && !reassignTo)}
              className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {del.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Eliminar
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
