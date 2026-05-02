import { useQuery } from "@tanstack/react-query"
import { listCategories } from "@/api/endpoints"
import type { Category } from "@/types/api"

export function useCategories(spendingOnly = false) {
  return useQuery<Category[]>({
    queryKey: ["categories", spendingOnly],
    queryFn: () => listCategories(spendingOnly),
    staleTime: 10 * 60 * 1000,
  })
}
