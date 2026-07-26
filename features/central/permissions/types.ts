import type { PaginatedMeta } from "@/features/central/shared/types"

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

export type PermissionStatistics = {
  total: number
  groups: number
  catalog_total: number
}

export type PaginatedPermissions = {
  data: PermissionItem[]
  meta: PaginatedMeta
}
