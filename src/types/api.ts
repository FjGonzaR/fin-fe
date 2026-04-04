// Types derived strictly from fin-be/openapi.yaml — do not invent fields

export type BankEnum = "BANCOLOMBIA" | "RAPPI"
export type OwnerEnum = "PACHO" | "LU"
export type AccountTypeEnum = "CREDITO" | "DEBITO" | "AHORROS"
export type Category =
  | "HOGAR"
  | "DOMICILIOS"
  | "CARRO"
  | "TRANSPORTE"
  | "OCIO"
  | "RESTAURANTES"
  | "ROPA"
  | "SALUD"
  | "PRESTACIONES"
  | "REGALOS"
  | "EDUCACION"
  | "TRABAJO"
  | "COBRO_BANCARIO"
  | "PAGO"
  | "PLATAFORMAS"
  | "INGRESO"
  | "INVERSION"
  | "OTROS"

export interface AccountResponse {
  id: string
  bank_name: BankEnum
  account_name: string
  owner: OwnerEnum
  account_type: AccountTypeEnum
  // TODO: GAP — no balance/saldo field in API (openapi.yaml AccountResponse schema)
}

export interface KPIResponse {
  total_ingresos: number
  total_gastos: number
  total_pagos: number
  total_inversiones: number
  net: number
  transaction_count: number
  avg_monthly_spend: number | null
}

export interface HistogramPoint {
  week: string // "YYYY-MM-DD" (Monday of the ISO week)
  total_spent: number
}

export interface CategoryBreakdownItem {
  category: string | null // null displayed as "SIN_CATEGORIZAR"
  total: number
  percentage: number
  count: number
}

export interface TopTransactionItem {
  id: string
  posted_at: string // date "YYYY-MM-DD"
  description_clean: string
  amount: number // absolute value (always positive per API spec)
  category: string | null
  merchant_guess: string | null
  account_name: string
  bank_name: BankEnum
  owner: OwnerEnum
  account_type: AccountTypeEnum
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export type CategoryMethod = "RULES" | "LLM" | "USER"

export interface TransactionResponse {
  id: string
  source_file_id: string
  posted_at: string // "YYYY-MM-DD"
  description_raw: string
  description_clean: string
  amount: number // negative = expense, positive = abono
  currency: string
  merchant_guess: string | null
  details_json: Record<string, unknown> | null
  category: Category | null
  category_confidence: number | null
  category_method: CategoryMethod | null
  created_at: string
  account_id: string
  account_name: string
  bank_name: BankEnum
  owner: OwnerEnum
  account_type: AccountTypeEnum
}

export interface RecategorizeRequest {
  category: Category
  description_clean?: string | null
}

export interface DashboardFilters {
  owner?: OwnerEnum
  account_id?: string
  date_from?: string // "YYYY-MM-DD"
  date_to?: string   // "YYYY-MM-DD"
  category?: Category
}

export type AppView = "dashboard" | "admin"

export type FileStatusEnum = "UPLOADED" | "PARSING" | "PROCESSED" | "FAILED"

export interface FileMetadata {
  file_id: string
  filename: string
  account_id: string
  account_name: string
  status: FileStatusEnum
  uploaded_at: string
  hash: string
}

export interface UploadResponse {
  file_id?: string   // per spec
  id?: string        // actual backend field (matches AccountResponse pattern)
  parse_status: string
  file_hash: string
  original_filename: string
  uploaded_at: string
}

export interface EtlStatusResponse {
  parsed_rows: number
  inserted_transactions: number
  duplicates_skipped: number
  status: "PROCESSED" | "ALREADY_PROCESSED" | "FAILED"
}

export interface FileUrlResponse {
  file_id: string
  url: string
  expires_in: number
}

export interface FilePreviewResponse {
  file_id: string
  filename: string
  columns: string[]
  rows: Record<string, string | number | null>[]
  total_rows: number
}

export interface CreateAccountRequest {
  bank_name: BankEnum
  account_name: string
  owner: OwnerEnum
  account_type: AccountTypeEnum
}

export interface UpdateAccountRequest {
  bank_name?: BankEnum
  account_name?: string
  owner?: OwnerEnum
  account_type?: AccountTypeEnum
}
