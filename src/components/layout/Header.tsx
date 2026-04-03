import { BarChart3, LayoutDashboard, Settings2, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import type { AppView } from "@/types/api"

interface HeaderProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
}

const NAV_ITEMS: { id: AppView; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "admin", label: "Admin", icon: Settings2 },
]

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="flex items-center gap-3 px-6 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 shrink-0">
        <BarChart3 className="h-5 w-5 text-white" />
      </div>
      <div className="shrink-0">
        <h1 className="text-lg font-bold text-gray-900">Finanzas</h1>
        <p className="text-xs text-gray-400">Dashboard personal</p>
      </div>

      <nav className="flex flex-1 items-center justify-center gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
              currentView === id
                ? "bg-gray-100 font-semibold text-gray-900"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 shrink-0"
        title="Cerrar sesión"
      >
        <LogOut className="h-3.5 w-3.5" />
        Salir
      </button>
    </header>
  )
}
