import { useQuery } from "@tanstack/react-query"
import { getDashboardByCategory } from "@/api/endpoints"
import type { DashboardFilters } from "@/types/api"

export function useByCategory(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["by-category", filters],
    queryFn: () => getDashboardByCategory(filters),
    staleTime: 2 * 60 * 1000,
  })
}
