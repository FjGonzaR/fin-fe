import { Header } from "@/components/layout/Header"
import { UsersTab } from "./UsersTab"
import type { AppView } from "@/types/api"

interface AdminLayoutProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
}

export function AdminLayout({ currentView, onViewChange }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <Header currentView={currentView} onViewChange={onViewChange} />

        <main className="space-y-6 px-4 pb-10 sm:px-6">
          <h2 className="text-xl font-bold text-gray-900">Administración</h2>
          <UsersTab />
        </main>
      </div>
    </div>
  )
}
