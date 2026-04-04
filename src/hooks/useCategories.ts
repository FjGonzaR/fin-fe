import { useQuery } from "@tanstack/react-query"
import { listCategories } from "@/api/endpoints"

export function useCategories(spendingOnly = false) {
  return useQuery<string[]>({
    queryKey: ["categories", spendingOnly],
    queryFn: () => listCategories(spendingOnly),
    staleTime: 10 * 60 * 1000, // categories rarely change
  })
}
