import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type { PaginatedMeta } from "@/types/central/user"
import type {
  CentralRole,
  PaginatedPermissions,
  PermissionGroup,
  PermissionItem,
  PermissionMatrix,
  PermissionStatistics,
  RoleStatistics,
} from "@/types/central/rbac"
import {
  type StorePermissionFormValues,
  type UpdatePermissionFormValues,
} from "@/features/central/permissions/schemas"
import {
  type StoreRoleFormValues,
  type UpdateRoleFormValues,
} from "@/features/central/roles/schemas"

export async function getRoles(
  params?: {
    search?: string
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<{ data: CentralRole[]; meta: PaginatedMeta }> {
  const response = await centralApiClient.get<
    ApiEnvelope<CentralRole[]> & { meta?: PaginatedMeta }
  >("/roles", { per_page: 100, ...params }, { signal })

  return {
    data: response.data,
    meta: (response.meta as PaginatedMeta) || {
      current_page: 1,
      last_page: 1,
      per_page: 100,
      total: response.data.length,
    },
  }
}

export async function getRole(id: number): Promise<CentralRole> {
  const response = await centralApiClient.get<ApiEnvelope<CentralRole>>(
    `/roles/${id}`
  )
  return response.data
}

export async function createRole(values: StoreRoleFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<CentralRole>>(
    "/roles",
    {
      name: values.name,
      permissions: values.permissions ?? [],
    }
  )
  return { data: response.data, message: response.message }
}

export async function updateRole(id: number, values: UpdateRoleFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<CentralRole>>(
    `/roles/${id}`,
    {
      name: values.name,
      permissions: values.permissions,
    }
  )
  return { data: response.data, message: response.message }
}

export async function deleteRole(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/roles/${id}`
  )
  return { data: null, message: response.message }
}

export async function deleteManyRoles(ids: number[]) {
  const response = await centralApiClient.delete<
    ApiEnvelope<{ deleted: number }>
  >("/roles/bulk", { ids })
  return { data: response.data, message: response.message }
}

export async function syncRolePermissions(id: number, permissions: string[]) {
  const response = await centralApiClient.put<ApiEnvelope<CentralRole>>(
    `/roles/${id}/permissions`,
    { permissions }
  )
  return { data: response.data, message: response.message }
}

export async function getRoleStatistics(): Promise<RoleStatistics> {
  const response = await centralApiClient.get<ApiEnvelope<RoleStatistics>>(
    "/roles/statistics"
  )
  return response.data
}

export async function getPermissions(): Promise<PermissionGroup[]> {
  const response = await centralApiClient.get<ApiEnvelope<PermissionGroup[]>>(
    "/permissions/grouped"
  )
  return response.data
}

export async function getPaginatedPermissions(
  params?: {
    search?: string
    group?: string
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<PaginatedPermissions> {
  const response = await centralApiClient.get<
    ApiEnvelope<PermissionItem[]> & { meta?: PaginatedMeta }
  >("/permissions", params, { signal })

  return {
    data: response.data,
    meta: (response.meta as PaginatedMeta) || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export async function getPermissionStatistics(): Promise<PermissionStatistics> {
  const response = await centralApiClient.get<
    ApiEnvelope<PermissionStatistics>
  >("/permissions/statistics")
  return response.data
}

export async function createPermission(values: StorePermissionFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<PermissionItem>>(
    "/permissions",
    { name: values.name }
  )
  return { data: response.data, message: response.message }
}

export async function updatePermission(
  id: number,
  values: UpdatePermissionFormValues
) {
  const response = await centralApiClient.put<ApiEnvelope<PermissionItem>>(
    `/permissions/${id}`,
    { name: values.name }
  )
  return { data: response.data, message: response.message }
}

export async function deletePermission(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/permissions/${id}`
  )
  return { data: null, message: response.message }
}

export async function deleteManyPermissions(ids: number[]) {
  const response = await centralApiClient.delete<
    ApiEnvelope<{ deleted: number }>
  >("/permissions/bulk", { ids })
  return { data: response.data, message: response.message }
}

export async function getPermissionMatrix(): Promise<PermissionMatrix> {
  const response = await centralApiClient.get<ApiEnvelope<PermissionMatrix>>(
    "/permissions/matrix"
  )
  return response.data
}
