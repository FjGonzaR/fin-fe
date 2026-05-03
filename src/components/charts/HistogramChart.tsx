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

const TOOLTIP_DARK = {
  background: "#0F172A",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
  padding: "6px 10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
} as const

export function HistogramChart({ filters }: HistogramChartProps) {
  const { data, isLoading, isError } = useHistogram(filters)

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-900">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="week"
                tickFormatter={formatWeekLabel}
                tick={{ fontSize: 12, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v: number) => formatCop(v, true)}
                tick={{ fontSize: 12, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value) => [formatCop(Number(value)), "Gastos"]}
                labelFormatter={(label) => `Semana del ${formatWeekLabel(String(label))}`}
                contentStyle={TOOLTIP_DARK}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#94A3B8", fontSize: 11, marginBottom: 2 }}
                cursor={{ fill: "#F1F5F9" }}
              />
              <Bar dataKey="total_spent" radius={[6, 6, 0, 0]} fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
