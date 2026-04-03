import { useQuery } from "@tanstack/react-query"
import { getFilePreview } from "@/api/endpoints"
import type { FilePreviewResponse } from "@/types/api"

export function useFilePreview(fileId: string | null, limit = 20) {
  return useQuery<FilePreviewResponse>({
    queryKey: ["file-preview", fileId, limit],
    queryFn: () => getFilePreview(fileId!, limit),
    enabled: !!fileId,
    staleTime: 5 * 60 * 1000,
  })
}
