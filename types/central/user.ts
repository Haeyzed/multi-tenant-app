export type UserStatus = "active" | "inactive" | "suspended"

export type CentralUser = {
  id: number
  name: string
  email: string
  phone: string | null
  timezone?: string | null
  status?: UserStatus | string | null
  status_label?: string | null
  email_verified_at?: string | null
  last_login_at?: string | null
  last_login_ip?: string | null
  two_factor_enabled?: boolean
  avatar_url?: string | null
  roles?: string[]
  permissions?: string[]
  created_at?: string | null
  created_at_human?: string | null
  updated_at?: string | null
  updated_at_human?: string | null
  deleted_at?: string | null
}

export type PaginatedMeta = {
  current_page: number
  from?: number | null
  last_page: number
  per_page: number
  to?: number | null
  total: number
  path?: string
}

export type PaginatedUsers = {
  data: CentralUser[]
  meta: PaginatedMeta
}

export type UserStatistics = {
  total: number
  active: number
  inactive: number
  suspended: number
  with_two_factor: number
  trashed: number
  by_status: Record<string, number>
}

export type UserSecurity = {
  two_factor_enabled: boolean
  last_login_at: string | null
  last_login_ip: string | null
  token_count: number
  email_verified: boolean
}

export type UserActivity = {
  id: number | string
  log_name: string | null
  description: string
  event: string | null
  subject_type: string | null
  subject_id: number | string | null
  causer_type: string | null
  causer_id: number | string | null
  created_at: string | null
}

export type PaginatedUserActivities = {
  data: UserActivity[]
  meta: PaginatedMeta
}
