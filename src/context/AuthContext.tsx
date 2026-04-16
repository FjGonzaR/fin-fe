import { createContext, useContext, useState, useEffect } from "react"
import { login as apiLogin } from "@/api/endpoints"
import { getToken, setToken, clearToken, registerUnauthorizedHandler } from "@/api/client"

const IS_ADMIN_KEY = "fin_is_admin"
const USERNAME_KEY = "fin_username"

function getStoredIsAdmin(): boolean {
  return localStorage.getItem(IS_ADMIN_KEY) === "true"
}

function getStoredUsername(): string {
  return localStorage.getItem(USERNAME_KEY) ?? ""
}

interface AuthContextValue {
  isAuthenticated: boolean
  isAdmin: boolean
  username: string
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  loginWithToken: (token: string, isAdmin: boolean, username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [isAdmin, setIsAdmin] = useState<boolean>(() => getStoredIsAdmin())
  const [username, setUsername] = useState<string>(() => getStoredUsername())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function logout() {
    clearToken()
    localStorage.removeItem(IS_ADMIN_KEY)
    localStorage.removeItem(USERNAME_KEY)
    setTokenState(null)
    setIsAdmin(false)
    setUsername("")
  }

  useEffect(() => {
    registerUnauthorizedHandler(logout)
  }, [])

  async function login(user: string, password: string) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiLogin(user, password)
      setToken(res.access_token)
      setTokenState(res.access_token)
      localStorage.setItem(IS_ADMIN_KEY, String(res.is_admin))
      localStorage.setItem(USERNAME_KEY, user)
      setIsAdmin(res.is_admin)
      setUsername(user)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  function loginWithToken(accessToken: string, adminFlag: boolean, user: string) {
    setToken(accessToken)
    setTokenState(accessToken)
    localStorage.setItem(IS_ADMIN_KEY, String(adminFlag))
    localStorage.setItem(USERNAME_KEY, user)
    setIsAdmin(adminFlag)
    setUsername(user)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, isAdmin, username, isLoading, error, login, loginWithToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
