import { useMutation, useQueryClient } from "@tanstack/react-query"
import { triggerEtl } from "@/api/endpoints"
import type { EtlStatusResponse } from "@/types/api"

export function useTriggerEtl() {
  const queryClient = useQueryClient()
  return useMutation<EtlStatusResponse, Error, string>({
    mutationFn: (fileId) => triggerEtl(fileId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["files"] })
    },
  })
}
