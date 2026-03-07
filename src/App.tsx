import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { buildMonthsParam, getDefaultMonthRange } from "@/lib/dateUtils"
import type { DashboardFilters } from "@/types/api"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const defaultRange = getDefaultMonthRange(3)
const defaultFilters: DashboardFilters = {
  months: buildMonthsParam(defaultRange.start, defaultRange.end),
}

export default function App() {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters)

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout filters={filters} onFiltersChange={setFilters} />
    </QueryClientProvider>
  )
}
