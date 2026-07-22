import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {StorePlanFormValues, UpdatePlanFormValues,} from "@/features/central/plans/schemas"
import {
    activateManyPlans,
    activatePlan,
    archiveManyPlans,
    archivePlan,
    createPlan,
    createPlanPrice,
    deleteManyPlans,
    deletePlan,
    deletePlanPrice,
    getPlanPrices,
    getPlans,
    getPlanStatistics,
    type PlanPricePayload,
    updatePlan,
    updatePlanPrice,
} from "@/lib/services/central/plan-service"

export const plansQueryKey = (params?: Record<string, unknown>) =>
    ["central", "plans", params ?? {}] as const

export const planStatisticsQueryKey = () =>
    ["central", "plans", "statistics"] as const

export function useGetPlans(params?: {
    search?: string
    status?: string
    visibility?: string
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: plansQueryKey(params),
        queryFn: () => getPlans(params),
    })
}

export function useGetPlanStatistics() {
    return useQuery({
        queryKey: planStatisticsQueryKey(),
        queryFn: getPlanStatistics,
    })
}

export function useCreatePlan() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: StorePlanFormValues) => createPlan(values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useUpdatePlan() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values: UpdatePlanFormValues
        }) => updatePlan(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useDeletePlan() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deletePlan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useActivatePlan() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => activatePlan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useArchivePlan() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => archivePlan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useDeleteManyPlans() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ids: number[]) => deleteManyPlans(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useActivateManyPlans() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ids: number[]) => activateManyPlans(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useArchiveManyPlans() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ids: number[]) => archiveManyPlans(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export const planPricesQueryKey = (planId: number) =>
    ["central", "plans", planId, "prices"] as const

export function usePlanPrices(planId: number | undefined) {
    return useQuery({
        queryKey: planPricesQueryKey(planId ?? 0),
        queryFn: () => getPlanPrices(planId as number),
        enabled: !!planId,
    })
}

export function useCreatePlanPrice(planId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: PlanPricePayload) => createPlanPrice(planId, values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: planPricesQueryKey(planId)})
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useUpdatePlanPrice(planId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         priceId,
                         values,
                     }: {
            priceId: number
            values: Partial<PlanPricePayload>
        }) => updatePlanPrice(planId, priceId, values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: planPricesQueryKey(planId)})
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}

export function useDeletePlanPrice(planId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (priceId: number) => deletePlanPrice(planId, priceId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: planPricesQueryKey(planId)})
            queryClient.invalidateQueries({queryKey: ["central", "plans"]})
        },
    })
}
