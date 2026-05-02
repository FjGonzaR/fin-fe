import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCategory } from "@/api/endpoints"
import type { Category, UpdateCategoryRequest } from "@/types/api"

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation<Category, Error, { id: string; body: UpdateCategoryRequest }>({
    mutationFn: ({ id, body }) => updateCategory(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "categories"] })
      void qc.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
