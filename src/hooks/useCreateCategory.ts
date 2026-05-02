import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory } from "@/api/endpoints"
import type { Category, CreateCategoryRequest } from "@/types/api"

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: (body) => createCategory(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "categories"] })
      void qc.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
