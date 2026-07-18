import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  StorePermissionFormValues,
  UpdatePermissionFormValues,
} from "@/features/central/permissions/schemas"
import {
  createPermission,
  deleteManyPermissions,
  deletePermission,
  getPaginatedPermissions,
  getPermissionMatrix,
  getPermissions,
  getPermissionStatistics,
  updatePermission,
} from "@/lib/services/central/rbac-service"

export const permissionsQueryKey = () => ["central", "permissions"] as const

export const permissionsGroupedQueryKey = () =>
  ["central", "permissions", "grouped"] as const

export const permissionsListQueryKey = (params?: Record<string, unknown>) =>
  ["central", "permissions", "list", params ?? {}] as const

export const permissionStatisticsQueryKey = () =>
  ["central", "permissions", "statistics"] as const

export const permissionMatrixQueryKey = () =>
  ["central", "permissions", "matrix"] as const

export function useGetPermissions(enabled = true) {
  return useQuery({
    queryKey: permissionsGroupedQueryKey(),
    queryFn: getPermissions,
    enabled,
  })
}

export function useGetPaginatedPermissions(params?: {
  search?: string
  group?: string
  per_page?: number
  page?: number
}) {
  return useQuery({
    queryKey: permissionsListQueryKey(params),
    queryFn: () => getPaginatedPermissions(params),
  })
}

export function useGetPermissionStatistics() {
  return useQuery({
    queryKey: permissionStatisticsQueryKey(),
    queryFn: getPermissionStatistics,
  })
}

export function useGetPermissionMatrix(enabled = true) {
  return useQuery({
    queryKey: permissionMatrixQueryKey(),
    queryFn: getPermissionMatrix,
    enabled,
  })
}

function invalidatePermissionQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["central", "permissions"] })
  queryClient.invalidateQueries({ queryKey: ["central", "roles", "statistics"] })
  queryClient.invalidateQueries({ queryKey: permissionMatrixQueryKey() })
}

export function useCreatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: StorePermissionFormValues) => createPermission(values),
    onSuccess: () => invalidatePermissionQueries(queryClient),
  })
}

export function useUpdatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number
      values: UpdatePermissionFormValues
    }) => updatePermission(id, values),
    onSuccess: () => invalidatePermissionQueries(queryClient),
  })
}

export function useDeletePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePermission(id),
    onSuccess: () => invalidatePermissionQueries(queryClient),
  })
}

export function useDeleteManyPermissions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyPermissions(ids),
    onSuccess: () => invalidatePermissionQueries(queryClient),
  })
}
