import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useCreateCategory } from "@/hooks/useCreateCategory"
import { useUpdateCategory } from "@/hooks/useUpdateCategory"
import type { Category } from "@/types/api"

interface Props {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SLUG_REGEX = /^[A-Z][A-Z0-9_]*$/

interface FormState {
  slug: string
  name: string
  description: string
  is_active: boolean
}

const EMPTY: FormState = { slug: "", name: "", description: "", is_active: true }

export function CategoryFormDialog({ category, open, onOpenChange }: Props) {
  const isEdit = !!category
  const create = useCreateCategory()
  const update = useUpdateCategory()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setError(null)
      setForm(
        category
          ? {
              slug: category.slug,
              name: category.name,
              description: category.description ?? "",
              is_active: category.is_active,
            }
          : EMPTY,
      )
    }
  }, [open, category])

  const isPending = create.isPending || update.isPending
  const slugValid = isEdit || SLUG_REGEX.test(form.slug)
  const isValid = form.name.trim() !== "" && (isEdit || (form.slug.trim() !== "" && slugValid))

  function handleSubmit() {
    if (!isValid) return
    setError(null)
    const description = form.description.trim() === "" ? null : form.description.trim()

    if (isEdit && category) {
      const body: Record<string, unknown> = { name: form.name.trim(), description }
      if (!category.is_system) {
        body.slug = form.slug.trim()
        body.is_active = form.is_active
      }
      update.mutate(
        { id: category.id, body },
        {
          onSuccess: () => onOpenChange(false),
          onError: (err) => setError(err.message),
        },
      )
    } else {
      create.mutate(
        { slug: form.slug.trim(), name: form.name.trim(), description },
        {
          onSuccess: () => onOpenChange(false),
          onError: (err) => setError(err.message),
        },
      )
    }
  }

  const slugLocked = isEdit && category?.is_system === true
  const activeLocked = isEdit && category?.is_system === true

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={form.slug}
              disabled={slugLocked}
              onChange={(e) =>
                setForm((f) => ({ ...f, slug: e.target.value.toUpperCase() }))
              }
              placeholder="MASCOTAS"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-400"
            />
            {!isEdit && form.slug && !slugValid && (
              <p className="mt-1 text-xs text-red-500">
                Debe empezar con letra mayúscula y solo usar A-Z, 0-9, _
              </p>
            )}
            {slugLocked && (
              <p className="mt-1 text-xs text-gray-400">Categoría de sistema — slug no editable</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Mascotas"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_active}
                disabled={activeLocked}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              />
              Activa
              {activeLocked && (
                <span className="text-xs text-gray-400">(sistema, no editable)</span>
              )}
            </label>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "Guardando…" : isEdit ? "Guardar" : "Crear"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
