// One function per operationId from openapi.yaml — contracts match YAML exactly
import { apiFetch, apiMutate, getToken } from "./client"
import type {
  TokenResponse,
  AccountResponse,
  DashboardFilters,
  OwnerEnum,
  KPIResponse,
  HistogramPoint,
  CategoryBreakdownItem,
  TopTransactionItem,
  TransactionResponse,
  RecategorizeRequest,
  FileMetadata,
  UploadResponse,
  EtlStatusResponse,
  FilePreviewResponse,
  FileUrlResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/types/api"

export async function login(username: string, password: string): Promise<TokenResponse> {
  const body = new URLSearchParams({ username, password })
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { detail?: string }
    throw new Error(err.detail ?? res.statusText)
  }
  return res.json() as Promise<TokenResponse>
}

export function listAccounts(owner?: OwnerEnum): Promise<AccountResponse[]> {
  return apiFetch<AccountResponse[]>("/accounts", { owner })
}

export function listCategories(spendingOnly = false): Promise<string[]> {
  return apiFetch<string[]>("/categories", { spending_only: spendingOnly ? "true" : undefined })
}

export function getDashboardKpis(filters: DashboardFilters): Promise<KPIResponse> {
  return apiFetch<KPIResponse>("/dashboard/kpis", {
    owner: filters.owner,
    account_id: filters.account_id,
    date_from: filters.date_from,
    date_to: filters.date_to,
    category: filters.category,
  })
}

export function getDashboardHistogram(filters: DashboardFilters): Promise<HistogramPoint[]> {
  return apiFetch<HistogramPoint[]>("/dashboard/histogram", {
    owner: filters.owner,
    account_id: filters.account_id,
    date_from: filters.date_from,
    date_to: filters.date_to,
    category: filters.category,
  })
}

export function getDashboardByCategory(
  filters: DashboardFilters,
): Promise<CategoryBreakdownItem[]> {
  return apiFetch<CategoryBreakdownItem[]>("/dashboard/by-category", {
    owner: filters.owner,
    account_id: filters.account_id,
    date_from: filters.date_from,
    date_to: filters.date_to,
    category: filters.category,
  })
}

export function listTransactions(filters: DashboardFilters): Promise<TransactionResponse[]> {
  return apiFetch<TransactionResponse[]>("/transactions", {
    owner: filters.owner,
    account_id: filters.account_id,
    date_from: filters.date_from,
    date_to: filters.date_to,
    category: filters.category,
  })
}

export function recategorizeTransaction(
  transactionId: string,
  body: RecategorizeRequest,
): Promise<TransactionResponse> {
  const token = getToken()
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  return fetch(
    `${import.meta.env.VITE_API_BASE_URL}/transactions/${transactionId}/categorize`,
    { method: "PATCH", headers, body: JSON.stringify(body) },
  ).then(async (res) => {
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { detail?: string }
      throw new Error(err.detail ?? res.statusText)
    }
    return res.json() as Promise<TransactionResponse>
  })
}

export function getDashboardTopTransactions(
  filters: DashboardFilters,
  limit = 5,
): Promise<TopTransactionItem[]> {
  return apiFetch<TopTransactionItem[]>("/dashboard/top-transactions", {
    owner: filters.owner,
    account_id: filters.account_id,
    date_from: filters.date_from,
    date_to: filters.date_to,
    limit: String(limit),
  })
}

// ── Admin: Files ────────────────────────────────────────────────────────────

export function listFiles(): Promise<FileMetadata[]> {
  return apiFetch<FileMetadata[]>("/files")
}

export function getFilePreview(fileId: string, limit = 20): Promise<FilePreviewResponse> {
  return apiFetch<FilePreviewResponse>(`/files/${fileId}/preview`, { limit: String(limit) })
}

export function getFileUrl(fileId: string): Promise<FileUrlResponse> {
  return apiFetch<FileUrlResponse>(`/files/${fileId}/url`)
}

export function deleteFile(fileId: string): Promise<void> {
  return apiMutate<void>(`/files/${fileId}`, "DELETE")
}

export function uploadFile(formData: FormData): Promise<UploadResponse> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  return fetch(`${import.meta.env.VITE_API_BASE_URL}/files/upload`, {
    method: "POST",
    headers,
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { detail?: string }
      throw new Error(err.detail ?? res.statusText)
    }
    return res.json() as Promise<UploadResponse>
  })
}

export function triggerEtl(fileId: string): Promise<EtlStatusResponse> {
  return apiMutate<EtlStatusResponse>(`/etl/process/${fileId}`, "POST")
}

export function resetEtl(fileId: string): Promise<void> {
  return apiMutate<void>(`/etl/reset/${fileId}`, "DELETE")
}

// ── Admin: Accounts ─────────────────────────────────────────────────────────

export function createAccount(body: CreateAccountRequest): Promise<AccountResponse> {
  return apiMutate<AccountResponse>("/accounts", "POST", body)
}

export function updateAccount(id: string, body: UpdateAccountRequest): Promise<AccountResponse> {
  return apiMutate<AccountResponse>(`/accounts/${id}`, "PUT", body)
}

export function deleteAccount(id: string): Promise<void> {
  return apiMutate<void>(`/accounts/${id}`, "DELETE")
}
