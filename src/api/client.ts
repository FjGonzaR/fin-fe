const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

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

  const response = await fetch(url.toString())

  if (!response.ok) {
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
