const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export const TOKEN_KEY = "fin_access_token"

let onUnauthorized: (() => void) | null = null

export function registerUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  detail: string
  constructor(status: number, detail: string) {
    super(`API ${status}: ${detail}`)
    this.name = "ApiError"
    this.status = status
    this.detail = detail
  }
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T> {
  const url = new URL(BASE_URL + path)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value)
      }
    }
  }

  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(url.toString(), { headers })

  if (!response.ok) {
    if (response.status === 401) {
      clearToken()
      onUnauthorized?.()
    }
    let detail = response.statusText
    try {
      const body = (await response.json()) as { detail?: string }
      if (body.detail) detail = String(body.detail)
    } catch {
      // ignore parse error
    }
    throw new ApiError(response.status, detail)
  }

  return response.json() as Promise<T>
}

export async function apiMutate<T>(
  path: string,
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  body?: unknown,
): Promise<T> {
  const url = new URL(BASE_URL + path)
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (body !== undefined) headers["Content-Type"] = "application/json"

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    if (response.status === 401) {
      clearToken()
      onUnauthorized?.()
    }
    let detail = response.statusText
    try {
      const b = (await response.json()) as { detail?: string }
      if (b.detail) detail = String(b.detail)
    } catch {
      // ignore
    }
    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
