import { AppShell } from "./AppShell"
import { FilterBar } from "@/components/filters/FilterBar"
import { KpiGrid } from "@/components/kpis/KpiGrid"
import { HistogramChart } from "@/components/charts/HistogramChart"
import { CategoryDonut } from "@/components/charts/CategoryDonut"
import { TransactionsList } from "@/components/transactions/TransactionsList"
import { BudgetProgress } from "@/components/budget/BudgetProgress"
import type { AppView, DashboardFilters } from "@/types/api"

interface DashboardLayoutProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  currentView: AppView
  onViewChange: (view: AppView) => void
}

export function DashboardLayout({ filters, onFiltersChange, currentView, onViewChange }: DashboardLayoutProps) {
  return (
    <AppShell currentView={currentView} onViewChange={onViewChange} title="Dashboard">
      <FilterBar filters={filters} onFiltersChange={onFiltersChange} />
      <KpiGrid filters={filters} />
      <HistogramChart filters={filters} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryDonut filters={filters} />
        <BudgetProgress filters={filters} />
      </div>
      <TransactionsList filters={filters} />
    </AppShell>
  )
}
