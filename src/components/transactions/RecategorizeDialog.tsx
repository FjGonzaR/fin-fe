import { useState } from "react"
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
import type { Category, TransactionResponse } from "@/types/api"

interface RecategorizeDialogProps {
  transaction: TransactionResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecategorizeDialog({ transaction, open, onOpenChange }: RecategorizeDialogProps) {
  const [selected, setSelected] = useState<Category | "">(
    (transaction.category as Category | null) ?? ""
  )
  const { mutate, isPending, isSuccess, reset } = useRecategorize()
  const { data: categories = [] } = useCategories()

  function handleSubmit() {
    if (!selected) return
    mutate(
      { id: transaction.id, body: { category: selected } },
      {
        onSuccess: () => {
          setTimeout(() => {
            onOpenChange(false)
            reset()
          }, 800)
        },
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
            onValueChange={(v) => setSelected(v as Category)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(cat) }}
                    />
                    {cat}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isPending ? "Guardando…" : isSuccess ? "Guardado" : "Guardar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
