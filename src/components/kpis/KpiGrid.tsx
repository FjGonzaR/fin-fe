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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <KpiCard
        title="Ingresos"
        value={data ? formatCop(data.total_ingresos) : "—"}
        isLoading={isLoading}
        valueColor="green"
      />
      <KpiCard
        title="Gastos"
        value={data ? formatCop(data.total_gastos) : "—"}
        isLoading={isLoading}
        valueColor="red"
      />
      <KpiCard
        title="Pagos Tarjeta"
        value={data ? formatCop(data.total_pagos) : "—"}
        isLoading={isLoading}
      />
      <KpiCard
        title="Inversiones"
        value={data ? formatCop(data.total_inversiones) : "—"}
        isLoading={isLoading}
      />
      <KpiCard
        title="Balance Neto"
        value={data ? formatCop(net) : "—"}
        isLoading={isLoading}
        valueColor={net >= 0 ? "green" : "red"}
      />
      <KpiCard
        title="Gasto Promedio/Día"
        value={data ? (data.avg_daily_spend != null ? formatCop(data.avg_daily_spend) : "—") : "—"}
        isLoading={isLoading}
      />
      <KpiCard
        title="Transacciones"
        value={data ? String(data.transaction_count) : "—"}
        isLoading={isLoading}
      />
    </div>
  )
}
