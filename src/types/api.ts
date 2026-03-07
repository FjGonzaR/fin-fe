// Types derived strictly from fin-be/openapi.yaml — do not invent fields

export type BankEnum = "BANCOLOMBIA" | "RAPPI"
export type OwnerEnum = "PACHO" | "LU"
export type AccountTypeEnum = "CREDITO" | "DEBITO"
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
  total_spent: number
  total_abonos: number
  net: number
  transaction_count: number
  expense_count: number
  abono_count: number
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
  months?: string // "YYYY-MM,YYYY-MM"
  category?: Category
}
