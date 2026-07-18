export type TenantStatus =
  | "pending"
  | "active"
  | "suspended"
  | "trial"
  | "expired"
  | "grace_period"
  | "archived"

export type TenantDomain = {
  id: number
  domain: string
  is_primary?: boolean
  status?: string
}

export type Tenant = {
  id: string
  name: string
  slug: string
  email: string | null
  phone: string | null
  status: TenantStatus
  status_label?: string | null
  can_access?: boolean
  tags?: string[]
  metadata?: Record<string, unknown> | null
  trial_ends_at: string | null
  suspended_at?: string | null
  suspended_reason?: string | null
  archived_at?: string | null
  domains_count?: number
  notes_count?: number
  domains?: TenantDomain[]
  created_at: string
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

export type PaginatedTenants = {
  data: Tenant[]
  meta: PaginatedMeta
}

export type TenantStatistics = {
  total: number
  active: number
  trial: number
  suspended: number
  pending: number
  archived: number
  trashed: number
  by_status: Record<string, number>
}
