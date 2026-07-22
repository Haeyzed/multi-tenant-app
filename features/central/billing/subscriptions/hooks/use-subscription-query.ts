import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {StoreSubscriptionFormValues} from "@/features/central/billing/subscriptions/schemas"
import {
    cancelSubscription,
    type ChangeSubscriptionPlanPayload,
    createSubscription,
    downgradeSubscription,
    expireSubscription,
    getSubscription,
    getSubscriptionHistory,
    getSubscriptions,
    getSubscriptionStatistics,
    markSubscriptionPastDue,
    pauseSubscription,
    renewSubscription,
    resumeSubscription,
    upgradeSubscription,
} from "@/lib/services/central/subscription-service"

export const subscriptionsQueryKey = (params?: Record<string, unknown>) =>
    ["central", "subscriptions", params ?? {}] as const

export const subscriptionQueryKey = (id: number) =>
    ["central", "subscriptions", id] as const

export const subscriptionHistoryQueryKey = (id: number) =>
    ["central", "subscriptions", id, "history"] as const

export const subscriptionStatisticsQueryKey = () =>
    ["central", "subscriptions", "statistics"] as const

function invalidateSubscriptionQueries(
    queryClient: ReturnType<typeof useQueryClient>
) {
    queryClient.invalidateQueries({queryKey: ["central", "subscriptions"]})
}

export function useGetSubscriptions(params?: {
    tenant_id?: string
    status?: string
    plan_id?: number
    gateway?: string
    search?: string
    start_date?: string
    end_date?: string
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: subscriptionsQueryKey(params),
        queryFn: () => getSubscriptions(params),
    })
}

export function useGetSubscriptionStatistics() {
    return useQuery({
        queryKey: subscriptionStatisticsQueryKey(),
        queryFn: getSubscriptionStatistics,
    })
}

export function useGetSubscription(id: number, enabled = true) {
    return useQuery({
        queryKey: subscriptionQueryKey(id),
        queryFn: () => getSubscription(id),
        enabled,
    })
}

export function useGetSubscriptionHistory(id: number, enabled = true) {
    return useQuery({
        queryKey: subscriptionHistoryQueryKey(id),
        queryFn: () => getSubscriptionHistory(id),
        enabled,
    })
}

export function useCreateSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: StoreSubscriptionFormValues) =>
            createSubscription(values),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}

export function useRenewSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => renewSubscription(id),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}

export function usePauseSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => pauseSubscription(id),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}

export function useResumeSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => resumeSubscription(id),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}

export function useExpireSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => expireSubscription(id),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}

export function useUpgradeSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values: ChangeSubscriptionPlanPayload
        }) => upgradeSubscription(id, values),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}

export function useDowngradeSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values: ChangeSubscriptionPlanPayload
        }) => downgradeSubscription(id, values),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}

export function useCancelSubscription() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values?: { immediately?: boolean; reason?: string | null }
        }) => cancelSubscription(id, values),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}

export function useMarkSubscriptionPastDue() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values?: { grace_days?: number }
        }) => markSubscriptionPastDue(id, values),
        onSuccess: () => invalidateSubscriptionQueries(queryClient),
    })
}
