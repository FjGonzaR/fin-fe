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
import { useTopTransactions } from "@/hooks/useTopTransactions"
import { formatCop } from "@/lib/formatCop"
import { getCategoryColor } from "@/lib/categoryColors"
import type { DashboardFilters } from "@/types/api"

interface TopTransactionsTableProps {
  filters: DashboardFilters
}

export function TopTransactionsTable({ filters }: TopTransactionsTableProps) {
  const { data, isLoading, isError } = useTopTransactions(filters, 5)

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-800">
          Top 5 Transacciones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-2">
        {isError && (
          <div className="px-6">
            <ErrorState message="No se pudo cargar las transacciones" />
          </div>
        )}
        {!isError && (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100">
                <TableHead className="pl-6 text-xs font-medium text-gray-400">Fecha</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Descripción</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Categoría</TableHead>
                <TableHead className="text-xs font-medium text-gray-400">Cuenta</TableHead>
                <TableHead className="pr-6 text-right text-xs font-medium text-gray-400">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-gray-50">
                    <TableCell className="pl-6"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                  </TableRow>
                ))}
              {!isLoading && (!data || data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                data &&
                data.map((txn) => (
                  <TableRow key={txn.id} className="border-gray-50 hover:bg-gray-50/50">
                    <TableCell className="pl-6 text-sm text-gray-500">
                      {new Date(txn.posted_at).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
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
                    <TableCell className="text-sm text-gray-500">
                      {txn.bank_name} · {txn.account_name}
                    </TableCell>
                    <TableCell className="pr-6 text-right text-sm font-semibold text-red-500">
                      {formatCop(txn.amount)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
