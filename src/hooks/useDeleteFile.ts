import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteFile } from "@/api/endpoints"

export function useDeleteFile() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (fileId) => deleteFile(fileId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["files"] })
    },
  })
}
