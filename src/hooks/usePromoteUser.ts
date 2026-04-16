import { useMutation, useQueryClient } from "@tanstack/react-query"
import { promoteUser } from "@/api/endpoints"
import type { UserSummary } from "@/types/api"

export function usePromoteUser() {
  const queryClient = useQueryClient()
  return useMutation<UserSummary, Error, string>({
    mutationFn: (userId) => promoteUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}
