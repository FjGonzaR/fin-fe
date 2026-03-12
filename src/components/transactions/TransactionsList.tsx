import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { RecategorizeDialog } from "./RecategorizeDialog"
import { useTransactions } from "@/hooks/useTransactions"
import { formatCop } from "@/lib/formatCop"
import { getCategoryColor } from "@/lib/categoryColors"
import { PencilIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react"
import type { DashboardFilters, TransactionResponse } from "@/types/api"

const PAGE_SIZE = 20

interface TransactionsListProps {
  filters: DashboardFilters
}

export function TransactionsList({ filters }: TransactionsListProps) {
  const { data, isLoading, isError } = useTransactions(filters)
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
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-800">
              Transacciones
            </CardTitle>
            {!isLoading && total > 0 && (
              <span className="text-xs text-gray-400">
                {from}–{to} de {total}
              </span>
            )}
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por descripción, categoría, banco…"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:outline-none"
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
            /* Fixed height + scroll independiente */
            <div className="h-[480px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                  <TableRow className="border-gray-100">
                    <TableHead className="pl-6 text-xs font-medium text-gray-400 w-24">Fecha</TableHead>
                    <TableHead className="text-xs font-medium text-gray-400">Descripción</TableHead>
                    <TableHead className="text-xs font-medium text-gray-400 w-36">Categoría</TableHead>
                    <TableHead className="text-xs font-medium text-gray-400 w-40">Cuenta</TableHead>
                    <TableHead className="text-right text-xs font-medium text-gray-400 w-32">Monto</TableHead>
                    <TableHead className="pr-4 w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading &&
                    Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i} className="border-gray-50">
                        <TableCell className="pl-6"><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                        <TableCell />
                      </TableRow>
                    ))}

                  {!isLoading && pageData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <EmptyState />
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    pageData.map((txn) => {
                      const isExpense = txn.amount < 0
                      return (
                        <TableRow key={txn.id} className="border-gray-50 hover:bg-gray-50/50">
                          <TableCell className="pl-6 text-sm text-gray-500 whitespace-nowrap">
                            {new Date(txn.posted_at).toLocaleDateString("es-CO", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </TableCell>

                          <TableCell className="max-w-[220px]">
                            <p className="truncate text-sm font-medium text-gray-800">
                              {txn.merchant_guess ?? txn.description_clean}
                            </p>
                            {txn.merchant_guess && (
                              <p className="truncate text-xs text-gray-400">{txn.description_clean}</p>
                            )}
                          </TableCell>

                          <TableCell>
                            <Badge
                              className="text-xs font-medium text-white"
                              style={{ backgroundColor: getCategoryColor(txn.category) }}
                            >
                              {txn.category ?? "SIN_CATEGORIZAR"}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                            {txn.bank_name} · {txn.account_name}
                          </TableCell>

                          <TableCell
                            className={`text-right text-sm font-semibold whitespace-nowrap ${
                              isExpense ? "text-red-500" : "text-green-600"
                            }`}
                          >
                            {formatCop(txn.amount)}
                          </TableCell>

                          <TableCell className="pr-4 text-right">
                            <button
                              onClick={() => setRecategorizing(txn)}
                              className="rounded-lg p-1.5 text-gray-300 hover:bg-gray-100 hover:text-gray-600"
                              title="Recategorizar"
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginación */}
          {!isError && !isLoading && total > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Anterior
              </button>
              <span className="text-xs text-gray-400">
                Página {safePage + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
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
