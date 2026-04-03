import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadFile } from "@/api/endpoints"
import type { UploadResponse } from "@/types/api"

export function useUploadFile() {
  const queryClient = useQueryClient()
  return useMutation<UploadResponse, Error, { file: File; accountId: string }>({
    mutationFn: ({ file, accountId }) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("account_id", accountId)
      return uploadFile(formData)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["files"] })
    },
  })
}
