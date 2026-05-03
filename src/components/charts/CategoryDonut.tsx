import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, type PieLabelRenderProps } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import { useByCategory } from "@/hooks/useByCategory"
import { useCategories } from "@/hooks/useCategories"
import { formatCop } from "@/lib/formatCop"
import { getCategoryColor } from "@/lib/categoryColors"
import type { DashboardFilters } from "@/types/api"

const RADIAN = Math.PI / 180
const LEGEND_THRESHOLD = 5

const TOOLTIP_DARK = {
  background: "#0F172A",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
  padding: "6px 10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
} as const

function InsideLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) {
  const pct = Number(percent ?? 0) * 100
  if (pct < 5) return null

  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.55
  const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN)
  const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${Math.round(pct)}%`}
    </text>
  )
}

interface CategoryDonutProps {
  filters: DashboardFilters
}

export function CategoryDonut({ filters }: CategoryDonutProps) {
  const { data, isLoading, isError } = useByCategory(filters)
  const { data: categories = [] } = useCategories()
  const slugToName = new Map(categories.map((c) => [c.slug, c.name]))

  const chartData = (data ?? []).map((item) => ({
    slug: item.category ?? "SIN_CATEGORIZAR",
    name: item.category ? (slugToName.get(item.category) ?? item.category) : "Sin categorizar",
    value: item.total,
    percentage: item.percentage,
    count: item.count,
  }))

  const legendItems = chartData.filter((d) => d.percentage >= LEGEND_THRESHOLD)
  const hiddenCount = chartData.length - legendItems.length

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Gastos por Categoría
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingSpinner />}
        {isError && <ErrorState message="No se pudo cargar la distribución" />}
        {!isLoading && !isError && chartData.length === 0 && <EmptyState />}
        {!isLoading && !isError && chartData.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={120}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                  labelLine={false}
                  label={InsideLabel}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.slug} fill={getCategoryColor(entry.slug)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, item) => {
                    const payload = item.payload as { name?: string; count?: number; percentage?: number } | undefined
                    return [
                      `${formatCop(Number(value))} · ${payload?.count ?? 0} txn · ${(payload?.percentage ?? 0).toFixed(1)}%`,
                      payload?.name ?? "",
                    ]
                  }}
                  contentStyle={TOOLTIP_DARK}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#94A3B8", fontSize: 11, marginBottom: 2 }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {legendItems.map((item) => (
                <div key={item.slug} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: getCategoryColor(item.slug) }}
                  />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
              ))}
              {hiddenCount > 0 && (
                <span className="text-xs text-slate-400">+{hiddenCount} más (ver al pasar)</span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
