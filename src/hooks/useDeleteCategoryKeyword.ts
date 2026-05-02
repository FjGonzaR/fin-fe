import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCategoryKeyword } from "@/api/endpoints"

export function useDeleteCategoryKeyword(categoryId: string) {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (kid) => deleteCategoryKeyword(categoryId, kid),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "categories", categoryId, "keywords"] })
    },
  })
}
