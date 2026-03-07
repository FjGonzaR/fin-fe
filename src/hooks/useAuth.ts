import { useState } from "react"
import { login as apiLogin } from "@/api/endpoints"
import { getToken, setToken, clearToken } from "@/api/client"

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  function logout() {
    clearToken()
    setTokenState(null)
  }

  return { isAuthenticated: !!token, isLoading, error, login, logout }
}
