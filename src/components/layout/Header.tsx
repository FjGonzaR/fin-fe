import { LogOut, Menu } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
        title="Cerrar sesión"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Salir</span>
      </button>
    </header>
  )
}
