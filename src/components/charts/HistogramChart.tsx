import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import { useHistogram } from "@/hooks/useHistogram"
import { formatCop } from "@/lib/formatCop"
import type { DashboardFilters } from "@/types/api"

interface HistogramChartProps {
  filters: DashboardFilters
}

function formatWeekLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
}

export function HistogramChart({ filters }: HistogramChartProps) {
  const { data, isLoading, isError } = useHistogram(filters)

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-800">
          Histograma de gastos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingSpinner />}
        {isError && <ErrorState message="No se pudo cargar el histograma" />}
        {!isLoading && !isError && (!data || data.length === 0) && <EmptyState />}
        {!isLoading && !isError && data && data.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="week"
                tickFormatter={formatWeekLabel}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v: number) => formatCop(v, true)}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value) => [formatCop(Number(value)), "Gastos"]}
                labelFormatter={(label) => `Semana del ${formatWeekLabel(String(label))}`}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                cursor={{ fill: "#f9fafb" }}
              />
              <Bar dataKey="total_spent" radius={[4, 4, 0, 0]} fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
