import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { UsersTab } from "./UsersTab"
import { FilesTab } from "./FilesTab"
import { AccountsTab } from "./AccountsTab"
import { CategoriesTab } from "./CategoriesTab"
import { AdminTabBar, type AdminTab } from "./AdminTabBar"
import type { AppView } from "@/types/api"

interface AdminLayoutProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
}

export function AdminLayout({ currentView, onViewChange }: AdminLayoutProps) {
  const [tab, setTab] = useState<AdminTab>("files")

  return (
    <AppShell currentView={currentView} onViewChange={onViewChange} title="Administración">
      <AdminTabBar activeTab={tab} onTabChange={setTab} />

      {tab === "files" && <FilesTab />}
      {tab === "accounts" && <AccountsTab />}
      {tab === "categories" && <CategoriesTab />}
      {tab === "users" && <UsersTab />}
    </AppShell>
  )
}
