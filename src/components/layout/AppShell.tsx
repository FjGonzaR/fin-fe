import { useState, type ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import type { AppView } from "@/types/api"

interface AppShellProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
  title: string
  children: ReactNode
}

export function AppShell({ currentView, onViewChange, title, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        currentView={currentView}
        onViewChange={onViewChange}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
