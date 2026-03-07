import { useQuery } from "@tanstack/react-query"
import { getDashboardTopTransactions } from "@/api/endpoints"
import type { DashboardFilters } from "@/types/api"

export function useTopTransactions(filters: DashboardFilters, limit = 5) {
  return useQuery({
    queryKey: ["top-transactions", filters, limit],
    queryFn: () => getDashboardTopTransactions(filters, limit),
    staleTime: 2 * 60 * 1000,
  })
}
