import { useState } from "react"
import { FileText, CreditCard } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { FilesTab } from "@/components/admin/FilesTab"
import { AccountsTab } from "@/components/admin/AccountsTab"
import { cn } from "@/lib/utils"
import type { AppView } from "@/types/api"

type AccountTab = "files" | "accounts"

const TABS: { id: AccountTab; label: string; icon: React.ElementType }[] = [
  { id: "files", label: "Archivos", icon: FileText },
  { id: "accounts", label: "Cuentas", icon: CreditCard },
]

interface AccountLayoutProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
}

export function AccountLayout({ currentView, onViewChange }: AccountLayoutProps) {
  const [activeTab, setActiveTab] = useState<AccountTab>("files")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <Header currentView={currentView} onViewChange={onViewChange} />

        <main className="space-y-6 px-4 pb-10 sm:px-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Mi cuenta</h2>
            <div className="flex w-full gap-1 rounded-xl bg-gray-100 p-1 sm:w-fit">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors sm:flex-none",
                    activeTab === id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "files" && <FilesTab />}
          {activeTab === "accounts" && <AccountsTab />}
        </main>
      </div>
    </div>
  )
}
