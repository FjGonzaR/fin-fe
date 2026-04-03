import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAccount } from "@/api/endpoints"
import type { AccountResponse, CreateAccountRequest } from "@/types/api"

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation<AccountResponse, Error, CreateAccountRequest>({
    mutationFn: (body) => createAccount(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })
}
