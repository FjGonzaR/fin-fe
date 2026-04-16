import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AccountLayout } from "@/components/account/AccountLayout"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { AuthPage } from "@/components/auth/AuthPage"
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
  const { isAuthenticated, isAdmin } = useAuth()
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters)
  const [view, setView] = useState<AppView>("dashboard")

  if (!isAuthenticated) return <AuthPage />

  const safeView: AppView = view === "admin" && !isAdmin ? "dashboard" : view

  if (safeView === "dashboard") {
    return (
      <DashboardLayout
        filters={filters}
        onFiltersChange={setFilters}
        currentView={safeView}
        onViewChange={setView}
      />
    )
  }
  if (safeView === "account") {
    return <AccountLayout currentView={safeView} onViewChange={setView} />
  }
  return <AdminLayout currentView={safeView} onViewChange={setView} />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}
