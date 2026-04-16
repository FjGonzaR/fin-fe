import { useState, type FormEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, AlertCircle } from "lucide-react"

interface RegisterPageProps {
  initialToken: string
  onRegister: (username: string, password: string, inviteToken: string) => void
  isLoading: boolean
  error: string | null
  onGoToLogin: () => void
}

export function RegisterPage({
  initialToken,
  onRegister,
  isLoading,
  error,
  onGoToLogin,
}: RegisterPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [inviteToken, setInviteToken] = useState(initialToken)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (username && password && inviteToken) onRegister(username, password, inviteToken)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
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
              Crear cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500" htmlFor="reg-username">
                  Usuario
                </label>
                <input
                  id="reg-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="elige un usuario"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500" htmlFor="reg-password">
                  Contraseña
                </label>
                <input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500" htmlFor="reg-token">
                  Código de invitación
                </label>
                <input
                  id="reg-token"
                  type="text"
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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
                disabled={isLoading || !username || !password || !inviteToken}
                className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Registrando…" : "Crear cuenta"}
              </button>

              <button
                type="button"
                onClick={onGoToLogin}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600"
              >
                ¿Ya tienes cuenta? Iniciar sesión
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
