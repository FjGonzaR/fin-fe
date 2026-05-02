import { useQuery } from "@tanstack/react-query"
import { listAdminCategories } from "@/api/endpoints"
import type { Category } from "@/types/api"

export function useAdminCategories(includeInactive = false) {
  return useQuery<Category[]>({
    queryKey: ["admin", "categories", includeInactive],
    queryFn: () => listAdminCategories(includeInactive),
  })
}
