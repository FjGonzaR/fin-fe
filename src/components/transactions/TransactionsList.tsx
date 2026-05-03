import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { RecategorizeDialog } from "./RecategorizeDialog"
import { useTransactions } from "@/hooks/useTransactions"
import { useCategories } from "@/hooks/useCategories"
import { formatCop } from "@/lib/formatCop"
import { getCategoryColor } from "@/lib/categoryColors"
import { getCategoryIcon } from "@/lib/categoryIcons"
import { PencilIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react"
import type { DashboardFilters, TransactionResponse } from "@/types/api"

const PAGE_SIZE = 20

interface TransactionsListProps {
  filters: DashboardFilters
}

function hexToRgba(hex: string, alpha: number): string {
  const m = hex.replace("#", "")
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function TransactionsList({ filters }: TransactionsListProps) {
  const { data, isLoading, isError } = useTransactions(filters)
  const { data: categories = [] } = useCategories()
  const slugToName = new Map(categories.map((c) => [c.slug, c.name]))
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const [recategorizing, setRecategorizing] = useState<TransactionResponse | null>(null)

  const filtered = search.trim()
    ? (data ?? []).filter((txn) => {
        const q = search.toLowerCase()
        return (
          txn.description_clean.toLowerCase().includes(q) ||
          (txn.merchant_guess ?? "").toLowerCase().includes(q) ||
          (txn.category ?? "").toLowerCase().includes(q) ||
          txn.bank_name.toLowerCase().includes(q)
        )
      })
    : (data ?? [])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageData = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const from = total === 0 ? 0 : safePage * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE + PAGE_SIZE, total)

  function handleSearch(value: string) {
    setSearch(value)
    setPage(0)
  }

  return (
    <>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Transacciones
            </CardTitle>
            {!isLoading && total > 0 && (
              <span className="text-xs text-slate-400">
                {from}–{to} de {total}
              </span>
            )}
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por descripción, categoría, banco…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isError && (
            <div className="px-6 py-4">
              <ErrorState message="No se pudieron cargar las transacciones" />
            </div>
          )}

          {!isError && (
            <div className="max-h-[560px] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 grid grid-cols-[44px_1fr_140px_96px_120px_36px] items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                <span />
                <span>Descripción</span>
                <span>Cuenta</span>
                <span>Fecha</span>
                <span className="text-right">Monto</span>
                <span />
              </div>

              {/* Rows */}
              <motion.div layout className="divide-y divide-slate-100">
                {isLoading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-[44px_1fr_140px_96px_120px_36px] items-center gap-3 px-6 py-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="ml-auto h-4 w-20" />
                      <span />
                    </div>
                  ))}

                {!isLoading && pageData.length === 0 && (
                  <div className="px-6 py-10">
                    <EmptyState />
                  </div>
                )}

                {!isLoading && (
                  <AnimatePresence mode="popLayout" initial={false}>
                    {pageData.map((txn) => {
                      const isExpense = txn.amount < 0
                      const catColor = getCategoryColor(txn.category)
                      const catName = txn.category ? (slugToName.get(txn.category) ?? txn.category) : "Sin categorizar"
                      return (
                      <motion.div
                        key={txn.id}
                        layout
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="grid grid-cols-[44px_1fr_140px_96px_120px_36px] items-center gap-3 px-6 py-3 hover:bg-slate-50/60"
                      >
                        <div
                          className="grid h-10 w-10 place-items-center rounded-full text-xl"
                          style={{ backgroundColor: hexToRgba(catColor, 0.12) }}
                          aria-hidden
                        >
                          {getCategoryIcon(txn.category)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {txn.merchant_guess ?? txn.description_clean}
                            </p>
                            <Badge
                              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                backgroundColor: hexToRgba(catColor, 0.12),
                                color: catColor,
                              }}
                            >
                              {catName}
                            </Badge>
                          </div>
                          {txn.merchant_guess && (
                            <p className="truncate text-xs text-slate-400">{txn.description_clean}</p>
                          )}
                        </div>

                        <div className="min-w-0 text-xs text-slate-500">
                          <div className="truncate">{txn.account_name}</div>
                          <div className="truncate text-slate-400">{txn.bank_name}</div>
                        </div>

                        <div className="text-xs text-slate-500 whitespace-nowrap">
                          {new Date(txn.posted_at).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </div>

                        <div
                          className={`text-right text-sm font-semibold tabular-nums whitespace-nowrap ${
                            isExpense ? "text-red-500" : "text-emerald-600"
                          }`}
                        >
                          {formatCop(txn.amount)}
                        </div>

                        <button
                          onClick={() => setRecategorizing(txn)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          title="Recategorizar"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                      )
                    })}
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          )}

          {!isError && !isLoading && total > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Anterior
              </button>
              <span className="text-xs text-slate-400">
                Página {safePage + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {recategorizing && (
        <RecategorizeDialog
          transaction={recategorizing}
          open={!!recategorizing}
          onOpenChange={(open) => { if (!open) setRecategorizing(null) }}
        />
      )}
    </>
  )
}
