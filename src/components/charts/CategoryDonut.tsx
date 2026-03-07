import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, type PieLabelRenderProps } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import { useByCategory } from "@/hooks/useByCategory"
import { formatCop } from "@/lib/formatCop"
import { getCategoryColor } from "@/lib/categoryColors"
import type { DashboardFilters } from "@/types/api"

const RADIAN = Math.PI / 180

// Renders label text at the midpoint of each arc (inside the segment — never clips)
function InsideLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) {
  const pct = Number(percent ?? 0) * 100
  if (pct < 5) return null

  const cxN = Number(cx)
  const cyN = Number(cy)
  const inner = Number(innerRadius)
  const outer = Number(outerRadius)
  const mid = Number(midAngle)

  const radius = inner + (outer - inner) * 0.55
  const x = cxN + radius * Math.cos(-mid * RADIAN)
  const y = cyN + radius * Math.sin(-mid * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${Math.round(pct)}%`}
    </text>
  )
}

interface CategoryDonutProps {
  filters: DashboardFilters
}

export function CategoryDonut({ filters }: CategoryDonutProps) {
  const { data, isLoading, isError } = useByCategory(filters)

  const chartData = (data ?? []).map((item) => ({
    name: item.category ?? "SIN_CATEGORIZAR",
    value: item.total,
    percentage: item.percentage,
    count: item.count,
  }))

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-800">
          Gastos por Categoría
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingSpinner />}
        {isError && <ErrorState message="No se pudo cargar la distribución" />}
        {!isLoading && !isError && chartData.length === 0 && <EmptyState />}
        {!isLoading && !isError && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={110}
                dataKey="value"
                strokeWidth={2}
                stroke="#fff"
                labelLine={false}
                label={InsideLabel}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, item) => {
                  const payload = item.payload as { name?: string; count?: number } | undefined
                  return [
                    `${formatCop(Number(value))} · ${payload?.count ?? 0} txn`,
                    payload?.name ?? "",
                  ]
                }}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
