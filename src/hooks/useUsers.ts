import { useQuery } from "@tanstack/react-query"
import { listUsers } from "@/api/endpoints"
import type { UserSummary } from "@/types/api"

export function useUsers() {
  return useQuery<UserSummary[]>({
    queryKey: ["admin", "users"],
    queryFn: listUsers,
    staleTime: 60 * 1000,
  })
}
