import { useQuery } from "@tanstack/react-query"
import { listTransactions } from "@/api/endpoints"
import type { DashboardFilters } from "@/types/api"

export function useTransactions(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => listTransactions(filters),
    staleTime: 2 * 60 * 1000,
  })
}
