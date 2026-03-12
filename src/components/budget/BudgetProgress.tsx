import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorState } from "@/components/shared/ErrorState"
import { useByCategory } from "@/hooks/useByCategory"
import { useKpis } from "@/hooks/useKpis"
import { CATEGORY_BUDGETS } from "@/lib/budgets"
import { getCategoryColor } from "@/lib/categoryColors"
import { formatCop } from "@/lib/formatCop"
import { countMonths } from "@/lib/dateUtils"
import type { DashboardFilters, Category } from "@/types/api"

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
  const { data, isLoading, isError, refetch } = useByCategory(filters)
  const { data: kpis } = useKpis(filters)
  const globalNet = kpis?.net ?? 0

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  const months = countMonths(filters.date_from, filters.date_to)

  const spendByCategory = new Map<string, number>()
  for (const item of data ?? []) {
    if (item.category) spendByCategory.set(item.category, item.total)
  }

  const rows = (Object.keys(CATEGORY_BUDGETS) as Category[]).map((cat) => {
    const budget = (CATEGORY_BUDGETS[cat] ?? 0) * months
    const spent = spendByCategory.get(cat) ?? 0
    const pct = budget > 0 ? (spent / budget) * 100 : 0
    return { cat, budget, spent, pct }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuesto por Categoría</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col gap-3">
          {rows.map(({ cat, budget, spent, pct }) => {
            const color = getCategoryColor(cat)
            const exceeded = pct >= 100
            const barWidth = Math.min(pct, 100)
            return (
              <div key={cat} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium text-gray-700">{cat}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className={exceeded ? `font-semibold ${exceededTextColor(globalNet)}` : ""}>
                      {formatCop(spent, true)}
                    </span>
                    <span>/</span>
                    <span>{formatCop(budget, true)}</span>
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
      </CardContent>
    </Card>
  )
}
