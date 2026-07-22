import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {StoreTenantFormValues, UpdateTenantFormValues,} from "@/features/central/tenants/schemas"
import {
    activateManyTenants,
    activateTenant,
    createTenant,
    deleteManyTenants,
    deleteTenant,
    getTenants,
    getTenantStatistics,
    suspendManyTenants,
    suspendTenant,
    updateTenant,
} from "@/lib/services/central/tenant-service"

export const tenantsQueryKey = (params?: Record<string, unknown>) =>
    ["central", "tenants", params ?? {}] as const

export const tenantStatisticsQueryKey = () =>
    ["central", "tenants", "statistics"] as const

export function useGetTenants(params?: {
    search?: string
    status?: string
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: tenantsQueryKey(params),
        queryFn: () => getTenants(params),
    })
}

export function useGetTenantStatistics() {
    return useQuery({
        queryKey: tenantStatisticsQueryKey(),
        queryFn: getTenantStatistics,
    })
}

export function useCreateTenant() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: StoreTenantFormValues) => createTenant(values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "tenants"]})
            queryClient.invalidateQueries({queryKey: tenantStatisticsQueryKey()})
        },
    })
}

export function useUpdateTenant() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: string
            values: UpdateTenantFormValues
        }) => updateTenant(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "tenants"]})
            queryClient.invalidateQueries({queryKey: tenantStatisticsQueryKey()})
        },
    })
}

export function useDeleteTenant() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteTenant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "tenants"]})
            queryClient.invalidateQueries({queryKey: tenantStatisticsQueryKey()})
        },
    })
}

export function useActivateTenant() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => activateTenant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "tenants"]})
            queryClient.invalidateQueries({queryKey: tenantStatisticsQueryKey()})
        },
    })
}

export function useSuspendTenant() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, reason}: { id: string; reason?: string }) =>
            suspendTenant(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "tenants"]})
            queryClient.invalidateQueries({queryKey: tenantStatisticsQueryKey()})
        },
    })
}

export function useDeleteManyTenants() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ids: string[]) => deleteManyTenants(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "tenants"]})
            queryClient.invalidateQueries({queryKey: tenantStatisticsQueryKey()})
        },
    })
}

export function useSuspendManyTenants() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ids, reason}: { ids: string[]; reason?: string }) =>
            suspendManyTenants(ids, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "tenants"]})
            queryClient.invalidateQueries({queryKey: tenantStatisticsQueryKey()})
        },
    })
}

export function useActivateManyTenants() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ids: string[]) => activateManyTenants(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "tenants"]})
            queryClient.invalidateQueries({queryKey: tenantStatisticsQueryKey()})
        },
    })
}
