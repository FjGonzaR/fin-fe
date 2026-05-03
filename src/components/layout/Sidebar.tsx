import { BarChart3, LayoutDashboard, FolderOpen, Settings2, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import type { AppView } from "@/types/api"

interface SidebarProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
  open: boolean
  onClose: () => void
}

const NAV_ITEMS: { id: AppView; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "account", label: "Mi cuenta", icon: FolderOpen },
  { id: "admin", label: "Admin", icon: Settings2, adminOnly: true },
]

function SidebarContent({
  currentView,
  onViewChange,
  onClose,
  showClose,
}: {
  currentView: AppView
  onViewChange: (view: AppView) => void
  onClose: () => void
  showClose: boolean
}) {
  const { isAdmin, username } = useAuth()
  return (
    <div className="flex h-full w-60 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Finanzas</div>
            <div className="text-xs text-slate-400">Dashboard personal</div>
          </div>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-slate-100"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-400">
          Menú
        </div>
        {NAV_ITEMS.filter(({ adminOnly }) => !adminOnly || isAdmin).map(({ id, label, icon: Icon }) => {
          const active = currentView === id
          return (
            <button
              key={id}
              onClick={() => {
                onViewChange(id)
                onClose()
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          )
        })}
      </nav>

      {username && (
        <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-400">
          Sesión: <span className="font-medium text-slate-600">{username}</span>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ currentView, onViewChange, open, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden lg:flex lg:shrink-0">
        <SidebarContent
          currentView={currentView}
          onViewChange={onViewChange}
          onClose={() => {}}
          showClose={false}
        />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute inset-y-0 left-0">
            <SidebarContent
              currentView={currentView}
              onViewChange={onViewChange}
              onClose={onClose}
              showClose
            />
          </div>
        </div>
      )}
    </>
  )
}
