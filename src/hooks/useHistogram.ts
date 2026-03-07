import { useQuery } from "@tanstack/react-query"
import { getDashboardHistogram } from "@/api/endpoints"
import type { DashboardFilters } from "@/types/api"

export function useHistogram(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["histogram", filters],
    queryFn: () => getDashboardHistogram(filters),
    staleTime: 2 * 60 * 1000,
  })
}
