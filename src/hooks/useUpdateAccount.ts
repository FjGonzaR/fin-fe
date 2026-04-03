import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAccount } from "@/api/endpoints"
import type { AccountResponse, UpdateAccountRequest } from "@/types/api"

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation<AccountResponse, Error, { id: string; body: UpdateAccountRequest }>({
    mutationFn: ({ id, body }) => updateAccount(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })
}
