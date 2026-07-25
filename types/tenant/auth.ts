import type { TenantUser } from "@/types/tenant/user"

export type TenantLoginData = {
  token: string
  token_type: string
  user: TenantUser
}
