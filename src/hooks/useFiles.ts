import { useQuery } from "@tanstack/react-query"
import { listFiles } from "@/api/endpoints"
import type { FileMetadata } from "@/types/api"

export function useFiles() {
  return useQuery<FileMetadata[]>({
    queryKey: ["files"],
    queryFn: listFiles,
    staleTime: 30 * 1000,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data?.some((f) => f.status === "PARSING" || f.status === "UPLOADED")) return 5000
      return false
    },
  })
}
