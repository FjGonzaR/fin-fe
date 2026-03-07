import { InboxIcon } from "lucide-react"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = "Sin datos para el período seleccionado" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400">
      <InboxIcon className="h-8 w-8" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
