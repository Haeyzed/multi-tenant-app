import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  PaginatedMeta,
  PaginatedTenants,
  Tenant,
  TenantStatistics,
} from "@/types/central/tenant"
import {
  type StoreTenantFormValues,
  type UpdateTenantFormValues,
} from "@/features/central/tenants/schemas"

export type TenantOption = {
  value: string
  label: string
}

function toPayload(values: StoreTenantFormValues | UpdateTenantFormValues) {
  const payload: Record<string, unknown> = {
    name: values.name,
    slug: values.slug || undefined,
    email: values.email || null,
    phone: values.phone || null,
    trial_ends_at: values.trial_ends_at || null,
  }

  if ("status" in values && values.status) {
    payload.status = values.status
  }

  if ("subdomain" in values && values.subdomain?.trim()) {
    payload.domain = values.subdomain.trim().toLowerCase()
  }

  return payload
}

export async function getTenants(params?: {
  search?: string
  status?: string
  per_page?: number
  page?: number
}): Promise<PaginatedTenants> {
  const response = await centralApiClient.get<
    ApiEnvelope<Tenant[]> & { meta?: PaginatedMeta }
  >("/tenants", params)

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

export async function getTenantOptions(search?: string): Promise<TenantOption[]> {
  const response = await centralApiClient.get<ApiEnvelope<TenantOption[]>>(
    "/tenants/options",
    search ? { search } : undefined
  )
  return response.data
}

export async function getTenant(id: string): Promise<Tenant> {
  const response = await centralApiClient.get<ApiEnvelope<Tenant>>(
    `/tenants/${id}`
  )
  return response.data
}

export async function createTenant(values: StoreTenantFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<Tenant>>(
    "/tenants",
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateTenant(id: string, values: UpdateTenantFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<Tenant>>(
    `/tenants/${id}`,
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteTenant(id: string) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/tenants/${id}`
  )
  return { data: null, message: response.message }
}

export async function activateTenant(id: string) {
  const response = await centralApiClient.post<ApiEnvelope<Tenant>>(
    `/tenants/${id}/activate`,
    {}
  )
  return { data: response.data, message: response.message }
}

export async function suspendTenant(id: string, reason?: string) {
  const response = await centralApiClient.post<ApiEnvelope<Tenant>>(
    `/tenants/${id}/suspend`,
    { reason }
  )
  return { data: response.data, message: response.message }
}

export async function deleteManyTenants(ids: string[]) {
  const response = await centralApiClient.delete<
    ApiEnvelope<{ deleted: number }>
  >("/tenants/bulk", { ids })
  return { data: response.data, message: response.message }
}

export async function suspendManyTenants(ids: string[], reason?: string) {
  const response = await centralApiClient.post<
    ApiEnvelope<{ suspended: number }>
  >("/tenants/bulk/suspend", { ids, reason })
  return { data: response.data, message: response.message }
}

export async function activateManyTenants(ids: string[]) {
  const response = await centralApiClient.post<
    ApiEnvelope<{ activated: number }>
  >("/tenants/bulk/activate", { ids })
  return { data: response.data, message: response.message }
}

export async function getTenantStatistics(): Promise<TenantStatistics> {
  const response = await centralApiClient.get<ApiEnvelope<TenantStatistics>>(
    "/tenants/statistics"
  )
  return response.data
}

export type TenantBillingProfile = {
  id: number
  tenant_id: string
  country_iso2: string | null
  currency: string | null
  preferred_gateway: string | null
  metadata?: Record<string, unknown> | null
}

export async function getTenantBillingProfile(
  tenantId: string
): Promise<TenantBillingProfile> {
  const response = await centralApiClient.get<
    ApiEnvelope<TenantBillingProfile>
  >(`/tenants/${tenantId}/billing-profile`)
  return response.data
}

export async function updateTenantBillingProfile(
  tenantId: string,
  values: {
    country_iso2?: string | null
    currency?: string | null
    preferred_gateway?: string | null
  }
) {
  const response = await centralApiClient.put<
    ApiEnvelope<TenantBillingProfile>
  >(`/tenants/${tenantId}/billing-profile`, values)
  return { data: response.data, message: response.message }
}
