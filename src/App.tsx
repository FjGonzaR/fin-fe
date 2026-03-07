import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { LoginPage } from "@/components/auth/LoginPage"
import { useAuth } from "@/hooks/useAuth"
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

function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters)
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout filters={filters} onFiltersChange={setFilters} />
    </QueryClientProvider>
  )
}

export default function App() {
  const { isAuthenticated, isLoading, error, login } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} isLoading={isLoading} error={error} />
  }

  return <Dashboard />
}
