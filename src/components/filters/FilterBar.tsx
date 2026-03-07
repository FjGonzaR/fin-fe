import { OwnerSelector } from "./OwnerSelector"
import { AccountSelector } from "./AccountSelector"
import { PeriodSelector } from "./PeriodSelector"
import { CategorySelector } from "./CategorySelector"
import type { DashboardFilters } from "@/types/api"

interface FilterBarProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  function handleOwnerChange(owner: DashboardFilters["owner"]) {
    // Changing owner clears account selection since accounts are owner-scoped
    onFiltersChange({ ...filters, owner, account_id: undefined })
  }

  function handleAccountChange(account_id: string | undefined) {
    onFiltersChange({ ...filters, account_id })
  }

  function handleMonthsChange(months: string | undefined) {
    onFiltersChange({ ...filters, months })
  }

  function handleCategoryChange(category: DashboardFilters["category"]) {
    onFiltersChange({ ...filters, category })
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm">
      <OwnerSelector value={filters.owner} onChange={handleOwnerChange} />
      <div className="h-5 w-px bg-gray-200" />
      <AccountSelector
        owner={filters.owner}
        value={filters.account_id}
        onChange={handleAccountChange}
      />
      <div className="h-5 w-px bg-gray-200" />
      <CategorySelector value={filters.category} onChange={handleCategoryChange} />
      <div className="ml-auto">
        <PeriodSelector months={filters.months} onChange={handleMonthsChange} />
      </div>
    </div>
  )
}
