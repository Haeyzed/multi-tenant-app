import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  StorePlanFormValues,
  UpdatePlanFormValues,
} from "@/features/central/plans/schemas"
import type {
  PaginatedMeta,
  PaginatedPlans,
  Plan,
  PlanPrice,
  PlanPriceInterval,
  PlanStatistics,
} from "@/types/central/plan"

export type PlanPricePayload = {
  amount: number
  currency: string
  billing_interval?: PlanPriceInterval
  trial_days?: number | null
  status?: "draft" | "active" | "inactive" | "archived"
  metadata?: Record<string, unknown> | null
}

function toPayload(values: StorePlanFormValues | UpdatePlanFormValues) {
  return {
    name: values.name,
    slug: values.slug || undefined,
    description: values.description || null,
    price: values.price,
    currency: values.currency.toUpperCase(),
    billing_interval: values.billing_interval,
    trial_days: values.trial_days,
    status: values.status,
    visibility: values.visibility,
    is_featured: values.is_featured,
    sort_order: values.sort_order,
  }
}

export async function getPlans(params?: {
  search?: string
  status?: string
  visibility?: string
  per_page?: number
  page?: number
}): Promise<PaginatedPlans> {
  const response = await centralApiClient.get<
    ApiEnvelope<Plan[]> & { meta?: PaginatedMeta }
  >("/plans", params)

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

export async function getPlanStatistics(): Promise<PlanStatistics> {
  const response = await centralApiClient.get<ApiEnvelope<PlanStatistics>>(
    "/plans/statistics"
  )
  return response.data
}

export async function createPlan(values: StorePlanFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<Plan>>(
    "/plans",
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updatePlan(id: number, values: UpdatePlanFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<Plan>>(
    `/plans/${id}`,
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deletePlan(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/plans/${id}`
  )
  return { data: null, message: response.message }
}

export async function activatePlan(id: number) {
  const response = await centralApiClient.post<ApiEnvelope<Plan>>(
    `/plans/${id}/activate`,
    {}
  )
  return { data: response.data, message: response.message }
}

export async function archivePlan(id: number) {
  const response = await centralApiClient.post<ApiEnvelope<Plan>>(
    `/plans/${id}/archive`,
    {}
  )
  return { data: response.data, message: response.message }
}

export async function deleteManyPlans(ids: number[]) {
  const response = await centralApiClient.delete<
    ApiEnvelope<{ deleted: number }>
  >("/plans/bulk", { ids })
  return { data: response.data, message: response.message }
}

export async function activateManyPlans(ids: number[]) {
  const response = await centralApiClient.post<
    ApiEnvelope<{ activated: number }>
  >("/plans/bulk/activate", { ids })
  return { data: response.data, message: response.message }
}

export async function archiveManyPlans(ids: number[]) {
  const response = await centralApiClient.post<
    ApiEnvelope<{ archived: number }>
  >("/plans/bulk/archive", { ids })
  return { data: response.data, message: response.message }
}

export async function getPlanPrices(planId: number): Promise<PlanPrice[]> {
  const response = await centralApiClient.get<ApiEnvelope<PlanPrice[]>>(
    `/plans/${planId}/prices`
  )
  return response.data
}

export async function createPlanPrice(
  planId: number,
  values: PlanPricePayload
) {
  const response = await centralApiClient.post<ApiEnvelope<PlanPrice>>(
    `/plans/${planId}/prices`,
    { ...values, currency: values.currency.toUpperCase() }
  )
  return { data: response.data, message: response.message }
}

export async function updatePlanPrice(
  planId: number,
  priceId: number,
  values: Partial<PlanPricePayload>
) {
  const response = await centralApiClient.put<ApiEnvelope<PlanPrice>>(
    `/plans/${planId}/prices/${priceId}`,
    {
      ...values,
      currency: values.currency ? values.currency.toUpperCase() : undefined,
    }
  )
  return { data: response.data, message: response.message }
}

export async function deletePlanPrice(planId: number, priceId: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/plans/${planId}/prices/${priceId}`
  )
  return { data: null, message: response.message }
}
