import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { AdminTabBar } from "./AdminTabBar"
import { FilesTab } from "./FilesTab"
import { AccountsTab } from "./AccountsTab"
import type { AppView } from "@/types/api"

type AdminTab = "files" | "accounts"

interface AdminLayoutProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
}

export function AdminLayout({ currentView, onViewChange }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("files")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <Header currentView={currentView} onViewChange={onViewChange} />

        <main className="space-y-6 px-4 pb-10 sm:px-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Administración</h2>
            </div>
            <AdminTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {activeTab === "files" && <FilesTab />}
          {activeTab === "accounts" && <AccountsTab />}
        </main>
      </div>
    </div>
  )
}
