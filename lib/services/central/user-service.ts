import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  CentralUser,
  PaginatedMeta,
  PaginatedUserActivities,
  PaginatedUsers,
  UserActivity,
  UserSecurity,
  UserStatistics,
  UserStatus,
} from "@/types/central/user"
import {
  type StoreUserFormValues,
  type UpdateUserFormValues,
} from "@/features/central/users/schemas"

function toPayload(values: StoreUserFormValues | UpdateUserFormValues) {
  const payload: Record<string, unknown> = {
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    timezone: values.timezone || undefined,
    roles: values.roles ?? [],
  }

  if ("status" in values && values.status) {
    payload.status = values.status
  }

  if ("password" in values && values.password) {
    payload.password = values.password
    payload.password_confirmation = values.password_confirmation
  }

  return payload
}

export async function getUsers(
  params?: {
    search?: string
    status?: string
    role?: string
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<PaginatedUsers> {
  const response = await centralApiClient.get<
    ApiEnvelope<CentralUser[]> & { meta?: PaginatedMeta }
  >("/users", params, { signal })

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

export async function getUser(id: number): Promise<CentralUser> {
  const response = await centralApiClient.get<ApiEnvelope<CentralUser>>(
    `/users/${id}`
  )
  return response.data
}

export async function createUser(values: StoreUserFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<CentralUser>>(
    "/users",
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateUser(id: number, values: UpdateUserFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<CentralUser>>(
    `/users/${id}`,
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteUser(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/users/${id}`
  )
  return { data: null, message: response.message }
}

export async function updateUserStatus(id: number, status: UserStatus) {
  const response = await centralApiClient.put<ApiEnvelope<CentralUser>>(
    `/users/${id}/status`,
    { status }
  )
  return { data: response.data, message: response.message }
}

export async function activateUser(id: number) {
  return updateUserStatus(id, "active")
}

export async function suspendUser(id: number) {
  return updateUserStatus(id, "suspended")
}

export async function deleteManyUsers(ids: number[]) {
  const response = await centralApiClient.delete<
    ApiEnvelope<{ deleted: number }>
  >("/users/bulk", { ids })
  return { data: response.data, message: response.message }
}

export async function suspendManyUsers(ids: number[]) {
  const response = await centralApiClient.post<
    ApiEnvelope<{ suspended: number }>
  >("/users/bulk/suspend", { ids })
  return { data: response.data, message: response.message }
}

export async function activateManyUsers(ids: number[]) {
  const response = await centralApiClient.post<
    ApiEnvelope<{ activated: number }>
  >("/users/bulk/activate", { ids })
  return { data: response.data, message: response.message }
}

export async function getUserStatistics(): Promise<UserStatistics> {
  const response = await centralApiClient.get<ApiEnvelope<UserStatistics>>(
    "/users/statistics"
  )
  return response.data
}

export async function syncUserRoles(id: number, roles: string[]) {
  const response = await centralApiClient.put<ApiEnvelope<CentralUser>>(
    `/users/${id}/roles`,
    { roles }
  )
  return { data: response.data, message: response.message }
}

export async function syncUserPermissions(id: number, permissions: string[]) {
  const response = await centralApiClient.put<ApiEnvelope<CentralUser>>(
    `/users/${id}/permissions`,
    { permissions }
  )
  return { data: response.data, message: response.message }
}

export async function uploadUserAvatar(id: number, file: File) {
  const formData = new FormData()
  formData.append("avatar", file)

  const response = await centralApiClient.upload<ApiEnvelope<CentralUser>>(
    `/users/${id}/avatar`,
    formData
  )
  return { data: response.data, message: response.message }
}

export async function getUserSecurity(id: number): Promise<UserSecurity> {
  const response = await centralApiClient.get<ApiEnvelope<UserSecurity>>(
    `/users/${id}/security`
  )
  return response.data
}

export async function getUserActivities(
  id: number,
  params?: { per_page?: number; page?: number }
): Promise<PaginatedUserActivities> {
  const response = await centralApiClient.get<
    ApiEnvelope<UserActivity[]> & { meta?: PaginatedMeta }
  >(`/users/${id}/activities`, params)

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
