import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategoryKeyword } from "@/api/endpoints"
import type { CategoryKeyword, CreateCategoryKeywordRequest } from "@/types/api"

export function useCreateCategoryKeyword(categoryId: string) {
  const qc = useQueryClient()
  return useMutation<CategoryKeyword, Error, CreateCategoryKeywordRequest>({
    mutationFn: (body) => createCategoryKeyword(categoryId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "categories", categoryId, "keywords"] })
    },
  })
}
