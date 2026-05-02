import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCategory } from "@/api/endpoints"

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation<void, Error, { id: string; reassignTo?: string }>({
    mutationFn: ({ id, reassignTo }) => deleteCategory(id, reassignTo),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "categories"] })
      void qc.invalidateQueries({ queryKey: ["categories"] })
      void qc.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
