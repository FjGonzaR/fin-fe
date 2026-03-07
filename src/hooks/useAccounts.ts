import { useQuery } from "@tanstack/react-query"
import { listAccounts } from "@/api/endpoints"
import type { OwnerEnum } from "@/types/api"

export function useAccounts(owner?: OwnerEnum) {
  return useQuery({
    queryKey: ["accounts", owner],
    queryFn: () => listAccounts(owner),
    staleTime: 5 * 60 * 1000,
  })
}
