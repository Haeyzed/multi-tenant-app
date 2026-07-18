import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  StoreUserFormValues,
  UpdateUserFormValues,
} from "@/features/central/users/schemas"
import {
  activateManyUsers,
  activateUser,
  createUser,
  deleteManyUsers,
  deleteUser,
  getUserActivities,
  getUsers,
  getUserSecurity,
  getUserStatistics,
  suspendManyUsers,
  suspendUser,
  syncUserPermissions,
  syncUserRoles,
  updateUser,
  uploadUserAvatar,
} from "@/lib/services/central/user-service"

export const usersQueryKey = (params?: Record<string, unknown>) =>
  ["central", "users", params ?? {}] as const

export const userStatisticsQueryKey = () =>
  ["central", "users", "statistics"] as const

export const userSecurityQueryKey = (id: number) =>
  ["central", "users", id, "security"] as const

export const userActivitiesQueryKey = (
  id: number,
  params?: Record<string, unknown>
) => ["central", "users", id, "activities", params ?? {}] as const

export function useGetUsers(params?: {
  search?: string
  status?: string
  role?: string
  per_page?: number
  page?: number
}) {
  return useQuery({
    queryKey: usersQueryKey(params),
    queryFn: () => getUsers(params),
  })
}

export function useGetUserStatistics() {
  return useQuery({
    queryKey: userStatisticsQueryKey(),
    queryFn: getUserStatistics,
  })
}

export function useGetUserSecurity(id: number, enabled = true) {
  return useQuery({
    queryKey: userSecurityQueryKey(id),
    queryFn: () => getUserSecurity(id),
    enabled: enabled && id > 0,
  })
}

export function useGetUserActivities(
  id: number,
  params?: { per_page?: number; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: userActivitiesQueryKey(id, params),
    queryFn: () => getUserActivities(id, params),
    enabled: enabled && id > 0,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: StoreUserFormValues) => createUser(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number
      values: UpdateUserFormValues
    }) => updateUser(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => suspendUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useDeleteManyUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useSuspendManyUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => suspendManyUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useActivateManyUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => activateManyUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useSyncUserRoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: string[] }) =>
      syncUserRoles(id, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useSyncUserPermissions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      permissions,
    }: {
      id: number
      permissions: string[]
    }) => syncUserPermissions(id, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}

export function useUploadUserAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadUserAvatar(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central", "users"] })
      queryClient.invalidateQueries({ queryKey: userStatisticsQueryKey() })
    },
  })
}
