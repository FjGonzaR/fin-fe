import { BarChart3, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
  const { logout } = useAuth()

  return (
    <header className="flex items-center gap-3 px-6 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
        <BarChart3 className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-bold text-gray-900">Finanzas</h1>
        <p className="text-xs text-gray-400">Dashboard personal</p>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        title="Cerrar sesión"
      >
        <LogOut className="h-3.5 w-3.5" />
        Salir
      </button>
    </header>
  )
}
