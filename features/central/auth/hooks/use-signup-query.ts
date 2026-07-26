import {useMutation, useQuery} from "@tanstack/react-query"

import {
    getPublicPlanOptions,
    getSignupPaymentOptions,
    publicSignupComplete,
    publicSignupSetup,
} from "@/lib/services/central/signup-service"
import type {PublicSignupPayload} from "@/features/central/auth/types"

export function usePublicPlanOptions(params?: { country?: string }) {
    return useQuery({
        queryKey: ["central", "public", "plan-options", params ?? {}],
        queryFn: () => getPublicPlanOptions(params),
        enabled: !!params?.country,
    })
}

export function useSignupPaymentOptions(params?: { country?: string }) {
    return useQuery({
        queryKey: ["central", "public", "signup-payment-options", params ?? {}],
        queryFn: () => getSignupPaymentOptions({country: params!.country!}),
        enabled: !!params?.country,
    })
}

export function usePublicSignupSetup() {
    return useMutation({
        mutationFn: (payload: PublicSignupPayload) => publicSignupSetup(payload),
    })
}

export function usePublicSignupComplete() {
    return useMutation({
        mutationFn: (payload: {
            signup_intent_id: string
            session_id?: string
            trxref?: string
            reference?: string
            transaction_id?: string
            id?: string
        }) => publicSignupComplete(payload),
    })
}
