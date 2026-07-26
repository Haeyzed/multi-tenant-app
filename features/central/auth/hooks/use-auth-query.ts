import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {centralApiClient} from "@/lib/api/central-client"
import {
    confirmTwoFactor,
    forgotPassword,
    getProfile,
    login,
    logout,
    resetPassword,
} from "@/lib/services/central/auth-service"
import type {ConfirmTwoFactorPayload, ResetPasswordPayload,} from "@/types/central/auth"

export const centralProfileQueryKey = ["central", "profile"] as const

export function useLogin() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (credentials: { email: string; password: string }) =>
            login(credentials),
        onSuccess: (data) => {
            if (!data.requires_two_factor) {
                queryClient.invalidateQueries({queryKey: centralProfileQueryKey})
            }
        },
    })
}

export function useConfirmTwoFactor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: ConfirmTwoFactorPayload) => confirmTwoFactor(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: centralProfileQueryKey})
        },
    })
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: (email: string) => forgotPassword(email),
    })
}

export function useResetPassword() {
    return useMutation({
        mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    })
}

export function useLogout() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            queryClient.setQueryData(centralProfileQueryKey, null)
            queryClient.removeQueries({queryKey: centralProfileQueryKey})
        },
    })
}

export function useGetProfile() {
    return useQuery({
        queryKey: centralProfileQueryKey,
        queryFn: ({signal}) => getProfile(signal),
        enabled: !!centralApiClient.getToken(),
        retry: false,
        staleTime: 5 * 60_000,
    })
}
