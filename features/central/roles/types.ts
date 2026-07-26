export type CentralRole = {
  id: number
  name: string
  guard_name?: string
  permissions?: string[]
  users_count?: number
  created_at?: string | null
  updated_at?: string | null
}

export type RoleStatistics = {
  total_roles: number
  total_permissions: number
  assigned_users: number
  groups: number
}
