import { KpiCard } from "./KpiCard"
import { ErrorState } from "@/components/shared/ErrorState"
import { useKpis } from "@/hooks/useKpis"
import { formatCop } from "@/lib/formatCop"
import type { DashboardFilters } from "@/types/api"

interface KpiGridProps {
  filters: DashboardFilters
}

export function KpiGrid({ filters }: KpiGridProps) {
  const { data, isLoading, isError } = useKpis(filters)

  if (isError) return <ErrorState message="No se pudieron cargar los KPIs" />

  const net = data?.net ?? 0

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <KpiCard
        title="Gastos Totales"
        value={data ? formatCop(data.total_spent) : "—"}
        isLoading={isLoading}
        valueColor="red"
      />
      <KpiCard
        title="Abonos"
        value={data ? formatCop(data.total_abonos) : "—"}
        isLoading={isLoading}
        valueColor="green"
      />
      <KpiCard
        title="Balance Neto"
        value={data ? formatCop(net) : "—"}
        isLoading={isLoading}
        valueColor={net >= 0 ? "green" : "red"}
      />
      <KpiCard
        title="Gasto Promedio/Mes"
        value={data ? (data.avg_monthly_spend != null ? formatCop(data.avg_monthly_spend) : "—") : "—"}
        isLoading={isLoading}
      />
      <KpiCard
        title="Transacciones"
        value={data ? String(data.transaction_count) : "—"}
        subtitle={data ? `${data.expense_count} gastos · ${data.abono_count} abonos` : undefined}
        isLoading={isLoading}
      />
    </div>
  )
}
