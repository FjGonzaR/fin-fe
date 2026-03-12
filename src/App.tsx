import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { LoginPage } from "@/components/auth/LoginPage"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { getDefaultMonthRange, monthToDateFrom, monthToDateTo } from "@/lib/dateUtils"
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
  date_from: monthToDateFrom(defaultRange.start),
  date_to: monthToDateTo(defaultRange.end),
}

function AppContent() {
  const { isAuthenticated, isLoading, error, login } = useAuth()
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters)

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} isLoading={isLoading} error={error} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout filters={filters} onFiltersChange={setFilters} />
    </QueryClientProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
