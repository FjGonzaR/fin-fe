import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message = "No se pudo cargar la información" }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-red-500">
      <AlertCircle className="h-8 w-8" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
