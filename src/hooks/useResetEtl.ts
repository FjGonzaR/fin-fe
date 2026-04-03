import { useMutation, useQueryClient } from "@tanstack/react-query"
import { resetEtl } from "@/api/endpoints"

export function useResetEtl() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (fileId) => resetEtl(fileId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["files"] })
      void queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
