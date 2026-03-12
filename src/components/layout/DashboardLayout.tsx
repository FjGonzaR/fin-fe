import { Header } from "./Header"
import { FilterBar } from "@/components/filters/FilterBar"
import { KpiGrid } from "@/components/kpis/KpiGrid"
import { HistogramChart } from "@/components/charts/HistogramChart"
import { CategoryDonut } from "@/components/charts/CategoryDonut"
import { TransactionsList } from "@/components/transactions/TransactionsList"
import { BudgetProgress } from "@/components/budget/BudgetProgress"
import type { DashboardFilters } from "@/types/api"

interface DashboardLayoutProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
}

export function DashboardLayout({ filters, onFiltersChange }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <Header />

        <main className="space-y-6 px-6 pb-10">
          <FilterBar filters={filters} onFiltersChange={onFiltersChange} />
          <KpiGrid filters={filters} />

          <HistogramChart filters={filters} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryDonut filters={filters} />
            <BudgetProgress filters={filters} />
          </div>

          <TransactionsList filters={filters} />
        </main>
      </div>
    </div>
  )
}
