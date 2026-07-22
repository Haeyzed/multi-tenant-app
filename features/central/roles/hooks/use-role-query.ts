import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {StoreRoleFormValues, UpdateRoleFormValues,} from "@/features/central/roles/schemas"
import {
    createRole,
    deleteManyRoles,
    deleteRole,
    getRole,
    getRoles,
    getRoleStatistics,
    syncRolePermissions,
    updateRole,
} from "@/lib/services/central/rbac-service"

export {
    useGetPermissionMatrix,
    useGetPermissions,
    permissionMatrixQueryKey,
    permissionsGroupedQueryKey,
} from "@/features/central/permissions/hooks/use-permission-query"

export const rolesQueryKey = (params?: Record<string, unknown>) =>
    ["central", "roles", params ?? {}] as const

export const roleQueryKey = (id: number) => ["central", "roles", id] as const

export const roleStatisticsQueryKey = () =>
    ["central", "roles", "statistics"] as const

export function useGetRoles(enabled = true) {
    return useQuery({
        queryKey: rolesQueryKey({per_page: 100}),
        queryFn: () => getRoles({per_page: 100}),
        enabled,
    })
}

export function useGetRole(id: number, enabled = true) {
    return useQuery({
        queryKey: roleQueryKey(id),
        queryFn: () => getRole(id),
        enabled: enabled && id > 0,
    })
}

export function useGetRoleStatistics() {
    return useQuery({
        queryKey: roleStatisticsQueryKey(),
        queryFn: getRoleStatistics,
    })
}

export function useCreateRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: StoreRoleFormValues) => createRole(values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "roles"]})
            queryClient.invalidateQueries({queryKey: roleStatisticsQueryKey()})
            queryClient.invalidateQueries({queryKey: ["central", "permissions", "matrix"]})
        },
    })
}

export function useUpdateRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values: UpdateRoleFormValues
        }) => updateRole(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "roles"]})
            queryClient.invalidateQueries({queryKey: roleStatisticsQueryKey()})
            queryClient.invalidateQueries({queryKey: ["central", "permissions", "matrix"]})
        },
    })
}

export function useDeleteRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "roles"]})
            queryClient.invalidateQueries({queryKey: roleStatisticsQueryKey()})
            queryClient.invalidateQueries({queryKey: ["central", "permissions", "matrix"]})
        },
    })
}

export function useDeleteManyRoles() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ids: number[]) => deleteManyRoles(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "roles"]})
            queryClient.invalidateQueries({queryKey: roleStatisticsQueryKey()})
            queryClient.invalidateQueries({queryKey: ["central", "permissions", "matrix"]})
        },
    })
}

export function useSyncRolePermissions() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         permissions,
                     }: {
            id: number
            permissions: string[]
        }) => syncRolePermissions(id, permissions),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "roles"]})
            queryClient.invalidateQueries({queryKey: roleStatisticsQueryKey()})
            queryClient.invalidateQueries({queryKey: ["central", "permissions", "matrix"]})
        },
    })
}
