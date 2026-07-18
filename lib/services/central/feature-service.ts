import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  StoreFeatureFormValues,
  UpdateFeatureFormValues,
} from "@/features/central/billing/features/schemas"
import type {
  Feature,
  PaginatedFeatures,
  PaginatedMeta,
} from "@/types/central/feature"

function toPayload(values: StoreFeatureFormValues | UpdateFeatureFormValues) {
  return {
    feature_category_id: values.feature_category_id ?? null,
    name: values.name,
    slug: values.slug || undefined,
    key: values.key || undefined,
    description: values.description || null,
    icon: values.icon || null,
    status: values.status,
    default_limit_type: values.default_limit_type,
    default_limit_value: values.default_limit_value ?? null,
    unit: values.unit || null,
    is_available: values.is_available,
    tracks_usage: values.tracks_usage,
    sort_order: values.sort_order,
  }
}

export async function getFeatures(params?: {
  search?: string
  status?: string
  category_id?: number
  per_page?: number
  page?: number
}): Promise<PaginatedFeatures> {
  const response = await centralApiClient.get<
    ApiEnvelope<Feature[]> & { meta?: PaginatedMeta }
  >("/features", params)

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

export async function createFeature(values: StoreFeatureFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<Feature>>(
    "/features",
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateFeature(
  id: number,
  values: UpdateFeatureFormValues
) {
  const response = await centralApiClient.put<ApiEnvelope<Feature>>(
    `/features/${id}`,
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteFeature(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/features/${id}`
  )
  return { data: null, message: response.message }
}
