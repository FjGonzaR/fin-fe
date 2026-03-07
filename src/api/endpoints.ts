// One function per operationId from openapi.yaml — contracts match YAML exactly
import { apiFetch, getToken } from "./client"
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

export function getDashboardKpis(filters: DashboardFilters): Promise<KPIResponse> {
  return apiFetch<KPIResponse>("/dashboard/kpis", {
    owner: filters.owner,
    account_id: filters.account_id,
    months: filters.months,
    category: filters.category,
  })
}

export function getDashboardHistogram(filters: DashboardFilters): Promise<HistogramPoint[]> {
  return apiFetch<HistogramPoint[]>("/dashboard/histogram", {
    owner: filters.owner,
    account_id: filters.account_id,
    months: filters.months,
    category: filters.category,
  })
}

export function getDashboardByCategory(
  filters: DashboardFilters,
): Promise<CategoryBreakdownItem[]> {
  return apiFetch<CategoryBreakdownItem[]>("/dashboard/by-category", {
    owner: filters.owner,
    account_id: filters.account_id,
    months: filters.months,
    category: filters.category,
  })
}

export function listTransactions(filters: DashboardFilters): Promise<TransactionResponse[]> {
  return apiFetch<TransactionResponse[]>("/transactions", {
    owner: filters.owner,
    account_id: filters.account_id,
    months: filters.months,
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
    months: filters.months,
    limit: String(limit),
  })
}
