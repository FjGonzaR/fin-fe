import { BarChart3 } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center gap-3 px-6 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
        <BarChart3 className="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-gray-900">Finanzas</h1>
        <p className="text-xs text-gray-400">Dashboard personal</p>
      </div>
    </header>
  )
}
