import { useMutation } from "@tanstack/react-query"
import { generateInvite } from "@/api/endpoints"
import type { InviteTokenResponse } from "@/types/api"

export function useGenerateInvite() {
  return useMutation<InviteTokenResponse, Error, void>({
    mutationFn: () => generateInvite(),
  })
}
