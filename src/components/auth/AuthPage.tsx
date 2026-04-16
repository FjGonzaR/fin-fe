import { useState, type FormEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useRegister } from "@/hooks/useRegister"

type AuthTab = "login" | "register"

export function AuthPage() {
  const { login, loginWithToken, isLoading, error } = useAuth()
  const registerMutation = useRegister()

  const [tab, setTab] = useState<AuthTab>(() =>
    new URLSearchParams(window.location.search).has("token") ? "register" : "login",
  )

  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [regUsername, setRegUsername] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [inviteToken, setInviteToken] = useState(
    () => new URLSearchParams(window.location.search).get("token") ?? "",
  )

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (loginUsername && loginPassword) void login(loginUsername, loginPassword)
  }

  function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (!regUsername || !regPassword || !inviteToken) return
    registerMutation.mutate(
      { username: regUsername, password: regPassword, invite_token: inviteToken },
      {
        onSuccess: (data) => {
          loginWithToken(data.access_token, data.is_admin, regUsername)
          window.history.replaceState({}, "", window.location.pathname)
        },
      },
    )
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"

  const loginError = error
  const registerError = registerMutation.error?.message ?? null

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

        <Card className="overflow-hidden rounded-2xl shadow-sm">
          <div className="flex border-b border-gray-100">
            {(["login", "register"] as AuthTab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors",
                  tab === t
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>

          <CardContent className="pt-5">
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500" htmlFor="login-username">
                    Usuario
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className={inputClass}
                    placeholder="tu usuario"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500" htmlFor="login-password">
                    Contraseña
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {loginError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !loginUsername || !loginPassword}
                  className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Entrando…" : "Entrar"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500" htmlFor="reg-username">
                    Usuario
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    autoComplete="username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className={inputClass}
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
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className={inputClass}
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
                    className={cn(inputClass, "font-mono")}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    required
                  />
                </div>

                {registerError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {registerError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    registerMutation.isPending || !regUsername || !regPassword || !inviteToken
                  }
                  className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {registerMutation.isPending ? "Registrando…" : "Crear cuenta"}
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
