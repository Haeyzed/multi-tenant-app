import {
  type ApiEnvelope,
  tenantApiClient,
} from "@/lib/api/tenant-client"
import type { TenantLoginData } from "@/types/tenant/auth"
import type { TenantUser } from "@/types/tenant/user"

export async function login(credentials: {
  email: string
  password: string
}): Promise<TenantLoginData> {
  const response = await tenantApiClient.post<ApiEnvelope<TenantLoginData>>(
    "/auth/login",
    credentials
  )

  if (response.data.token) {
    tenantApiClient.setToken(response.data.token)
  }

  return response.data
}

export async function logout() {
  try {
    await tenantApiClient.post<ApiEnvelope<null>>("/auth/logout", {})
  } finally {
    tenantApiClient.setToken(null)
  }
}

export async function getProfile(): Promise<TenantUser> {
  const response = await tenantApiClient.get<ApiEnvelope<TenantUser>>("/auth/me")
  return response.data
}
