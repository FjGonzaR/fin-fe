import { useMutation } from "@tanstack/react-query"
import { register } from "@/api/endpoints"
import type { TokenResponse, RegisterRequest } from "@/types/api"

export function useRegister() {
  return useMutation<TokenResponse, Error, RegisterRequest>({
    mutationFn: (body) => register(body),
  })
}
