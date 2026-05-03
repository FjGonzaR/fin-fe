import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Pencil, Trash2, Plus, Tags } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminCategories } from "@/hooks/useAdminCategories"
import { useUpdateCategory } from "@/hooks/useUpdateCategory"
import { CategoryFormDialog } from "./CategoryFormDialog"
import { CategoryDeleteDialog } from "./CategoryDeleteDialog"
import { CategoryKeywordsDialog } from "./CategoryKeywordsDialog"
import { getCategoryColor } from "@/lib/categoryColors"
import type { Category } from "@/types/api"

export function CategoriesTab() {
  const [includeInactive, setIncludeInactive] = useState(false)
  const { data: categories, isLoading } = useAdminCategories(includeInactive)
  const update = useUpdateCategory()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [keywordsFor, setKeywordsFor] = useState<Category | null>(null)

  function handleNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(cat: Category) {
    setEditing(cat)
    setFormOpen(true)
  }

  function handleToggleActive(cat: Category) {
    if (cat.is_system) return
    update.mutate({ id: cat.id, body: { is_active: !cat.is_active } })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-slate-800">Categorías</h3>
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
            Mostrar inactivas
          </label>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva categoría
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {isLoading && (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}

        {!isLoading && (!categories || categories.length === 0) && (
          <p className="py-8 text-center text-sm text-slate-400">No hay categorías.</p>
        )}

        {!isLoading && categories && categories.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">Nombre</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">Slug</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">Tipo</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">Activa</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
              {categories.map((cat, idx) => (
                <motion.tr
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={idx < categories.length - 1 ? "border-b border-slate-100" : ""}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: getCategoryColor(cat.slug) }}
                      />
                      <span className="font-medium text-slate-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{cat.slug}</td>
                  <td className="px-4 py-2.5">
                    {cat.is_system ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        sistema
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        custom
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <label className="inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={cat.is_active}
                        disabled={cat.is_system || update.isPending}
                        onChange={() => handleToggleActive(cat)}
                        className="cursor-pointer disabled:cursor-not-allowed"
                      />
                    </label>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setKeywordsFor(cat)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Keywords"
                      >
                        <Tags className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(cat)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(cat)}
                        disabled={cat.is_system}
                        className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:hover:bg-transparent"
                        title={cat.is_system ? "Sistema (no eliminable)" : "Eliminar"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      <CategoryFormDialog
        category={editing}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
      />

      <CategoryDeleteDialog
        category={deleting}
        allCategories={categories ?? []}
        onClose={() => setDeleting(null)}
      />

      <CategoryKeywordsDialog
        category={keywordsFor}
        onClose={() => setKeywordsFor(null)}
      />
    </div>
  )
}
