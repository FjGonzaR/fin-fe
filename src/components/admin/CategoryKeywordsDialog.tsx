import { useState } from "react"
import { Plus, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategoryKeywords } from "@/hooks/useCategoryKeywords"
import { useCreateCategoryKeyword } from "@/hooks/useCreateCategoryKeyword"
import { useDeleteCategoryKeyword } from "@/hooks/useDeleteCategoryKeyword"
import type { Category, CategoryKeyword } from "@/types/api"

interface Props {
  category: Category | null
  onClose: () => void
}

export function CategoryKeywordsDialog({ category, onClose }: Props) {
  const id = category?.id ?? null
  const { data: keywords, isLoading } = useCategoryKeywords(id)
  const create = useCreateCategoryKeyword(id ?? "")
  const del = useDeleteCategoryKeyword(id ?? "")
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (!category) return null

  const manual = (keywords ?? []).filter((k) => k.origin === "MANUAL")
  const learned = (keywords ?? [])
    .filter((k) => k.origin === "LEARNED")
    .sort((a, b) => b.weight - a.weight)

  function handleAdd() {
    if (!input.trim() || !id) return
    setError(null)
    create.mutate(
      { keyword: input.trim() },
      {
        onSuccess: () => setInput(""),
        onError: (err) => setError(err.message),
      },
    )
  }

  function handleDelete(kid: string) {
    setError(null)
    del.mutate(kid, { onError: (err) => setError(err.message) })
  }

  return (
    <Dialog open={!!category} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Keywords · <span className="font-mono text-sm">{category.slug}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add manual */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
              placeholder="Nueva keyword manual…"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim() || create.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {create.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Agregar
            </button>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <KeywordList
                title="Manuales"
                items={manual}
                showWeight={false}
                onDelete={handleDelete}
                pendingDelete={del.isPending && del.variables}
              />
              <KeywordList
                title="Aprendidas"
                items={learned}
                showWeight
                onDelete={handleDelete}
                pendingDelete={del.isPending && del.variables}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ListProps {
  title: string
  items: CategoryKeyword[]
  showWeight: boolean
  onDelete: (kid: string) => void
  pendingDelete: string | false | undefined
}

function KeywordList({ title, items, showWeight, onDelete, pendingDelete }: ListProps) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title} <span className="text-gray-400">({items.length})</span>
      </h4>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">Sin keywords</p>
      ) : (
        <ul className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-2">
          {items.map((k) => (
            <li
              key={k.id}
              className="flex items-center justify-between gap-2 rounded bg-white px-2 py-1.5 text-sm"
            >
              <span className="truncate font-mono text-xs text-gray-700">{k.keyword}</span>
              <div className="flex items-center gap-2">
                {showWeight && (
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                    {k.weight}
                  </span>
                )}
                <button
                  onClick={() => onDelete(k.id)}
                  disabled={pendingDelete === k.id}
                  className="rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                  title="Eliminar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
