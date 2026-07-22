import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {
    StoreFeatureCategoryFormValues,
    UpdateFeatureCategoryFormValues,
} from "@/features/central/billing/feature-categories/schemas"
import {
    createFeatureCategory,
    deleteFeatureCategory,
    getFeatureCategories,
    getFeatureCategoryOptions,
    updateFeatureCategory,
} from "@/lib/services/central/feature-category-service"

export const featureCategoriesQueryKey = () =>
    ["central", "feature-categories"] as const

export const featureCategoryOptionsQueryKey = () =>
    ["central", "feature-categories", "options"] as const

function invalidateFeatureCategoryQueries(
    queryClient: ReturnType<typeof useQueryClient>
) {
    queryClient.invalidateQueries({
        queryKey: ["central", "feature-categories"],
    })
}

export function useGetFeatureCategories() {
    return useQuery({
        queryKey: featureCategoriesQueryKey(),
        queryFn: () => getFeatureCategories(),
    })
}

export function useGetFeatureCategoryOptions(enabled = true) {
    return useQuery({
        queryKey: featureCategoryOptionsQueryKey(),
        queryFn: () => getFeatureCategoryOptions(),
        enabled,
    })
}

export function useCreateFeatureCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: StoreFeatureCategoryFormValues) =>
            createFeatureCategory(values),
        onSuccess: () => {
            invalidateFeatureCategoryQueries(queryClient)
        },
    })
}

export function useUpdateFeatureCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values: UpdateFeatureCategoryFormValues
        }) => updateFeatureCategory(id, values),
        onSuccess: () => {
            invalidateFeatureCategoryQueries(queryClient)
        },
    })
}

export function useDeleteFeatureCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteFeatureCategory(id),
        onSuccess: () => {
            invalidateFeatureCategoryQueries(queryClient)
        },
    })
}
