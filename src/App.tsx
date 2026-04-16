import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { LoginPage } from "@/components/auth/LoginPage"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { getDefaultDayRange } from "@/lib/dateUtils"
import type { AppView, DashboardFilters } from "@/types/api"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const defaultFilters: DashboardFilters = getDefaultDayRange()

function AppContent() {
  const { isAuthenticated, isLoading, error, login } = useAuth()
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters)
  const [view, setView] = useState<AppView>("dashboard")

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} isLoading={isLoading} error={error} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      {view === "dashboard" ? (
        <DashboardLayout
          filters={filters}
          onFiltersChange={setFilters}
          currentView={view}
          onViewChange={setView}
        />
      ) : (
        <AdminLayout currentView={view} onViewChange={setView} />
      )}
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
