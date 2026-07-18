import type { PaginatedMeta } from "@/types/central/user"

export type CentralRole = {
  id: number
  name: string
  guard_name?: string
  permissions?: string[]
  users_count?: number
  created_at?: string | null
  updated_at?: string | null
}

export type PermissionItem = {
  id: number
  name: string
  guard_name: string
  group?: string
  created_at?: string | null
  updated_at?: string | null
}

export type PermissionGroup = {
  group: string
  permissions: PermissionItem[]
}

export type PermissionMatrixRole = {
  id: number
  name: string
  permissions: string[]
  users_count: number
}

export type PermissionMatrix = {
  groups: PermissionGroup[]
  roles: PermissionMatrixRole[]
  matrix: Record<string, string[]>
}

export type RoleStatistics = {
  total_roles: number
  total_permissions: number
  assigned_users: number
  groups: number
}

export type PermissionStatistics = {
  total: number
  groups: number
  catalog_total: number
}

export type PaginatedPermissions = {
  data: PermissionItem[]
  meta: PaginatedMeta
}
