import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { tenantApiClient } from "@/lib/api/tenant-client"
import {
  getProfile,
  login,
  logout,
  redeemImpersonation,
  setupPassword,
} from "@/lib/services/tenant/auth-service"

export const tenantProfileQueryKey = ["tenant", "profile"] as const

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantProfileQueryKey })
    },
  })
}

export function useSetupPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      token: string
      password: string
      password_confirmation: string
    }) => setupPassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantProfileQueryKey })
    },
  })
}

export function useRedeemImpersonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (token: string) => redeemImpersonation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantProfileQueryKey })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.setQueryData(tenantProfileQueryKey, null)
      queryClient.removeQueries({ queryKey: tenantProfileQueryKey })
    },
  })
}

export function useGetProfile() {
  return useQuery({
    queryKey: tenantProfileQueryKey,
    queryFn: getProfile,
    enabled: !!tenantApiClient.getToken(),
    retry: false,
  })
}
