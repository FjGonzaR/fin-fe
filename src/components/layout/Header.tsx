import { BarChart3, LayoutDashboard, Settings2, LogOut, UserCircle, FolderOpen } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import type { AppView } from "@/types/api"

interface HeaderProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
}

const NAV_ITEMS: { id: AppView; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "account", label: "Mi cuenta", icon: FolderOpen },
  { id: "admin", label: "Admin", icon: Settings2, adminOnly: true },
]

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { logout, isAdmin, username } = useAuth()

  return (
    <header className="flex items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 sm:h-9 sm:w-9">
        <BarChart3 className="h-4 w-4 text-white sm:h-5 sm:w-5" />
      </div>
      <div className="shrink-0">
        <h1 className="text-base font-bold text-gray-900 sm:text-lg">Finanzas</h1>
        <p className="hidden text-xs text-gray-400 sm:block">Dashboard personal</p>
      </div>

      {username && (
        <div className="flex shrink-0 items-center gap-1 text-xs text-gray-500">
          <UserCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{username}</span>
        </div>
      )}

      <nav className="flex flex-1 items-center justify-center gap-0.5 sm:gap-1">
        {NAV_ITEMS.filter(({ adminOnly }) => !adminOnly || isAdmin).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-colors sm:gap-1.5 sm:px-3 sm:text-sm",
              currentView === id
                ? "bg-gray-100 font-semibold text-gray-900"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 sm:px-3"
        title="Cerrar sesión"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Salir</span>
      </button>
    </header>
  )
}
