import { FileText, CreditCard, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type AdminTab = "files" | "accounts" | "users"

interface AdminTabBarProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "files", label: "Archivos", icon: FileText },
  { id: "accounts", label: "Cuentas", icon: CreditCard },
  { id: "users", label: "Usuarios", icon: Users },
]

export function AdminTabBar({ activeTab, onTabChange }: AdminTabBarProps) {
  return (
    <div className="flex w-full gap-1 rounded-xl bg-gray-100 p-1 sm:w-fit">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
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
  )
}
