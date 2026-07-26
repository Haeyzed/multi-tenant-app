import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {StoreFeatureFormValues, UpdateFeatureFormValues,} from "@/features/central/billing/features/schemas"
import {createFeature, deleteFeature, getFeatures, updateFeature,} from "@/lib/services/central/feature-service"
import {listQueryOptions} from "@/lib/query/query-options"

export const featuresQueryKey = (params?: Record<string, unknown>) =>
    ["central", "features", params ?? {}] as const

export function useGetFeatures(params?: {
    search?: string
    status?: string
    category_id?: number
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: featuresQueryKey(params),
        queryFn: ({signal}) => getFeatures(params, signal),
        ...listQueryOptions,
    })
}

export function useCreateFeature() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: StoreFeatureFormValues) => createFeature(values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "features"]})
        },
    })
}

export function useUpdateFeature() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values: UpdateFeatureFormValues
        }) => updateFeature(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "features"]})
        },
    })
}

export function useDeleteFeature() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteFeature(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "features"]})
        },
    })
}
