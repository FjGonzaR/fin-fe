import { createContext, useContext, useState, useEffect } from "react"
import { login as apiLogin } from "@/api/endpoints"
import { getToken, setToken, clearToken, registerUnauthorizedHandler } from "@/api/client"

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function logout() {
    clearToken()
    setTokenState(null)
  }

  useEffect(() => {
    registerUnauthorizedHandler(logout)
  }, [])

  async function login(username: string, password: string) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiLogin(username, password)
      setToken(res.access_token)
      setTokenState(res.access_token)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
