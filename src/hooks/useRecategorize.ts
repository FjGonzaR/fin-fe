import { useMutation, useQueryClient } from "@tanstack/react-query"
import { recategorizeTransaction } from "@/api/endpoints"
import type { RecategorizeRequest } from "@/types/api"

export function useRecategorize() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: RecategorizeRequest }) =>
      recategorizeTransaction(id, body),
    onSuccess: () => {
      // Invalidate all transactions queries so the list refreshes
      void queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
