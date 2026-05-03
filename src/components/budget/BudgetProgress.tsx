import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorState } from "@/components/shared/ErrorState"
import { useByCategory } from "@/hooks/useByCategory"
import { useKpis } from "@/hooks/useKpis"
import { useCategories } from "@/hooks/useCategories"
import { useBudgets, setBudget } from "@/lib/budgetsStore"
import { getCategoryColor } from "@/lib/categoryColors"
import { formatCop } from "@/lib/formatCop"
import { countDays } from "@/lib/dateUtils"
import type { DashboardFilters } from "@/types/api"

interface BudgetProgressProps {
  filters: DashboardFilters
}

function barColor(pct: number, globalNet: number): string {
  if (pct >= 100) return globalNet >= 0 ? "bg-yellow-400" : "bg-red-400"
  if (pct >= 80) return "bg-yellow-400"
  return "bg-green-400"
}

function exceededTextColor(globalNet: number): string {
  return globalNet >= 0 ? "text-yellow-600" : "text-red-500"
}

export function BudgetProgress({ filters }: BudgetProgressProps) {
  const { data, isLoading, isError } = useByCategory(filters)
  const { data: kpis } = useKpis(filters)
  const { data: categories = [] } = useCategories(true)
  const budgets = useBudgets()
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [draft, setDraft] = useState<string>("")

  const globalNet = kpis?.net ?? 0

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState />

  const days = countDays(filters.date_from, filters.date_to)

  const spendByCategory = new Map<string, number>()
  for (const item of data ?? []) {
    if (item.category) spendByCategory.set(item.category, item.total)
  }

  const EXCLUDED = new Set(["MOVIMIENTO_ENTRE_BANCOS", "PAGO"])

  const rows = categories
    .filter((c) => c.is_active && !EXCLUDED.has(c.slug))
    .map((c) => {
      const monthly = budgets[c.slug] ?? 0
      const budget = monthly * (days / 30)
      const spent = spendByCategory.get(c.slug) ?? 0
      const pct = budget > 0 ? (spent / budget) * 100 : 0
      return { slug: c.slug, name: c.name, monthly, budget, spent, pct }
    })
    .sort((a, b) => b.monthly - a.monthly || a.name.localeCompare(b.name))

  const totalSpent = rows.reduce((s, r) => s + r.spent, 0)
  const totalBudget = rows.reduce((s, r) => s + r.budget, 0)
  const totalPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const totalExceeded = totalPct >= 100

  const startEdit = (slug: string, monthly: number) => {
    setEditingSlug(slug)
    setDraft(String(monthly))
  }

  const commit = (slug: string) => {
    const n = Number(draft.replace(/[^\d]/g, ""))
    if (!Number.isNaN(n)) setBudget(slug, n)
    setEditingSlug(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuesto por Categoría</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col gap-3">
          {rows.map(({ slug, name, monthly, budget, spent, pct }) => {
            const color = getCategoryColor(slug)
            const exceeded = pct >= 100
            const barWidth = Math.min(pct, 100)
            const isEditing = editingSlug === slug
            return (
              <div key={slug} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium text-gray-700">{name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className={exceeded ? `font-semibold ${exceededTextColor(globalNet)}` : ""}>
                      {formatCop(spent, true)}
                    </span>
                    <span>/</span>
                    {isEditing ? (
                      <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => commit(slug)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commit(slug)
                          if (e.key === "Escape") setEditingSlug(null)
                        }}
                        className="w-24 rounded border border-gray-300 px-1 py-0.5 text-right text-xs focus:border-gray-500 focus:outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(slug, monthly)}
                        className="rounded px-1 py-0.5 hover:bg-gray-100"
                        title="Editar presupuesto mensual"
                      >
                        {formatCop(budget, true)}
                      </button>
                    )}
                    <span className={`ml-1 font-semibold ${exceeded ? exceededTextColor(globalNet) : "text-gray-600"}`}>
                      {Math.round(pct)}%{exceeded ? " ⚠" : ""}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full transition-all ${barColor(pct, globalNet)}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-800">Total</span>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span className={`font-semibold ${totalExceeded ? exceededTextColor(globalNet) : ""}`}>
                {formatCop(totalSpent, true)}
              </span>
              <span>/</span>
              <span className="font-semibold">{formatCop(totalBudget, true)}</span>
              <span className={`ml-1 font-semibold ${totalExceeded ? exceededTextColor(globalNet) : "text-gray-700"}`}>
                {Math.round(totalPct)}%{totalExceeded ? " ⚠" : ""}
              </span>
            </div>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full transition-all ${barColor(totalPct, globalNet)}`}
              style={{ width: `${Math.min(totalPct, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
