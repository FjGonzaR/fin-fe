import { useQuery } from "@tanstack/react-query"
import { listCategoryKeywords } from "@/api/endpoints"
import type { CategoryKeyword } from "@/types/api"

export function useCategoryKeywords(categoryId: string | null) {
  return useQuery<CategoryKeyword[]>({
    queryKey: ["admin", "categories", categoryId, "keywords"],
    queryFn: () => listCategoryKeywords(categoryId as string),
    enabled: !!categoryId,
  })
}
