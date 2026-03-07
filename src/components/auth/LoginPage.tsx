import { useState, type FormEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, AlertCircle } from "lucide-react"

interface LoginPageProps {
  onLogin: (username: string, password: string) => void
  isLoading: boolean
  error: string | null
}

export function LoginPage({ onLogin, isLoading, error }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (username && password) onLogin(username, password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">Finanzas</h1>
            <p className="text-sm text-gray-400">Dashboard personal</p>
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-800">
              Iniciar sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500" htmlFor="username">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="tu usuario"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Entrando…" : "Entrar"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
