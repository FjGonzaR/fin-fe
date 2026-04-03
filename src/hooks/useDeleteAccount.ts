import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAccount } from "@/api/endpoints"

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteAccount(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })
}
