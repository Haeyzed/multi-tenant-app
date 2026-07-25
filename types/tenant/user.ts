export type TenantUser = {
  id: number
  name: string
  email: string
  phone: string | null
  is_active?: boolean
  avatar_url?: string | null
  roles?: string[]
  permissions?: string[]
  entitlements?: Record<string, unknown>
  created_at?: string | null
}
