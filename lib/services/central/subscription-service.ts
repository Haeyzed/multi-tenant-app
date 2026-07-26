import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  PaginatedMeta,
  PaginatedSubscriptions,
  Subscription,
  SubscriptionHistory,
  SubscriptionStatistics,
} from "@/types/central/subscription"

export type SubscriptionOption = {
  value: string
  label: string
}

export type CreateSubscriptionPayload = {
  tenant_id: string
  plan_id: number
  country?: string
  plan_price_id?: number | null
  currency?: string
  billing_interval?: string | null
  gateway?: string
  trial_days?: number | null
}

export type ChangeSubscriptionPlanPayload = {
  plan_id: number
  country?: string
  plan_price_id?: number | null
  currency?: string
  billing_interval?: string | null
}

export async function getSubscriptions(
  params?: {
    tenant_id?: string
    status?: string
    plan_id?: number
    gateway?: string
    search?: string
    start_date?: string
    end_date?: string
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<PaginatedSubscriptions> {
  const response = await centralApiClient.get<
      ApiEnvelope<Subscription[]> & { meta?: PaginatedMeta }
  >("/subscriptions", params, { signal })

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

export async function getSubscriptionOptions(params?: {
  tenant_id?: string
  search?: string
}): Promise<SubscriptionOption[]> {
  const response = await centralApiClient.get<ApiEnvelope<SubscriptionOption[]>>(
    "/subscriptions/options",
    params
  )
  return response.data
}

export async function getSubscriptionStatistics(): Promise<SubscriptionStatistics> {
  const response = await centralApiClient.get<
    ApiEnvelope<SubscriptionStatistics>
  >("/subscriptions/statistics")
  return response.data
}

export async function getSubscription(id: number): Promise<Subscription> {
  const response = await centralApiClient.get<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}`
  )
  return response.data
}

export async function createSubscription(values: CreateSubscriptionPayload) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    "/subscriptions",
    {
      ...values,
      country: values.country || undefined,
      currency: values.currency || undefined,
      plan_price_id: values.plan_price_id || undefined,
      gateway: values.gateway || undefined,
    }
  )
  return { data: response.data, message: response.message }
}

export async function renewSubscription(id: number) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}/renew`,
    {}
  )
  return { data: response.data, message: response.message }
}

export async function pauseSubscription(id: number) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}/pause`,
    {}
  )
  return { data: response.data, message: response.message }
}

export async function resumeSubscription(id: number) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}/resume`,
    {}
  )
  return { data: response.data, message: response.message }
}

export async function expireSubscription(id: number) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}/expire`,
    {}
  )
  return { data: response.data, message: response.message }
}

export async function upgradeSubscription(
  id: number,
  values: ChangeSubscriptionPlanPayload
) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}/upgrade`,
    {
      ...values,
      country: values.country || undefined,
      currency: values.currency || undefined,
      plan_price_id: values.plan_price_id || undefined,
    }
  )
  return { data: response.data, message: response.message }
}

export async function downgradeSubscription(
  id: number,
  values: ChangeSubscriptionPlanPayload
) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}/downgrade`,
    {
      ...values,
      country: values.country || undefined,
      currency: values.currency || undefined,
      plan_price_id: values.plan_price_id || undefined,
    }
  )
  return { data: response.data, message: response.message }
}

export async function cancelSubscription(
  id: number,
  values?: { immediately?: boolean; reason?: string | null }
) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}/cancel`,
    values ?? {}
  )
  return { data: response.data, message: response.message }
}

export async function markSubscriptionPastDue(
  id: number,
  values?: { grace_days?: number }
) {
  const response = await centralApiClient.post<ApiEnvelope<Subscription>>(
    `/subscriptions/${id}/past-due`,
    values ?? {}
  )
  return { data: response.data, message: response.message }
}

export async function getSubscriptionHistory(
  id: number
): Promise<SubscriptionHistory[]> {
  const response = await centralApiClient.get<
    ApiEnvelope<SubscriptionHistory[]>
  >(`/subscriptions/${id}/history`)
  return response.data
}
