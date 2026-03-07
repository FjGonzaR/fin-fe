import { useQuery } from "@tanstack/react-query"
import { getDashboardKpis } from "@/api/endpoints"
import type { DashboardFilters } from "@/types/api"

export function useKpis(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["kpis", filters],
    queryFn: () => getDashboardKpis(filters),
    staleTime: 2 * 60 * 1000,
  })
}
