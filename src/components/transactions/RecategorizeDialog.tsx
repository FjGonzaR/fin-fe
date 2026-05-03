import { useState } from "react"
import { toast } from "sonner"
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
import { useRecategorize } from "@/hooks/useRecategorize"
import { getCategoryColor } from "@/lib/categoryColors"
import { useCategories } from "@/hooks/useCategories"
import type { TransactionResponse } from "@/types/api"

interface RecategorizeDialogProps {
  transaction: TransactionResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecategorizeDialog({ transaction, open, onOpenChange }: RecategorizeDialogProps) {
  const [selected, setSelected] = useState<string>(transaction.category ?? "")
  const { mutate, isPending, isSuccess, reset, error } = useRecategorize()
  const { data: categories = [] } = useCategories()

  function handleSubmit() {
    if (!selected) return
    mutate(
      { id: transaction.id, body: { category_slug: selected } },
      {
        onSuccess: () => {
          toast.success("Transacción recategorizada")
          setTimeout(() => {
            onOpenChange(false)
            reset()
          }, 600)
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  const label = transaction.merchant_guess ?? transaction.description_clean

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-gray-800 leading-snug">
            Recategorizar
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1 truncate">{label}</p>
        </DialogHeader>

        <div className="py-2">
          <Select
            value={selected}
            onValueChange={(v) => setSelected(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(cat.slug) }}
                    />
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="mt-2 text-xs text-red-500">{error.message}</p>}
        </div>

        <DialogFooter>
          <button
            onClick={() => handleOpenChange(false)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selected || isPending || isSuccess}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Guardando…" : isSuccess ? "Guardado" : "Guardar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
