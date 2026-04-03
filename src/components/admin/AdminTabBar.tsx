import { FileText, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

type AdminTab = "files" | "accounts"

interface AdminTabBarProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "files", label: "Archivos", icon: FileText },
  { id: "accounts", label: "Cuentas", icon: CreditCard },
]

export function AdminTabBar({ activeTab, onTabChange }: AdminTabBarProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
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
