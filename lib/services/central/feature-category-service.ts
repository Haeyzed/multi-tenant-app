import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  StoreFeatureCategoryFormValues,
  UpdateFeatureCategoryFormValues,
} from "@/features/central/billing/feature-categories/schemas"
import type { FeatureCategory } from "@/types/central/feature-category"

function toPayload(
  values: StoreFeatureCategoryFormValues | UpdateFeatureCategoryFormValues
) {
  return {
    name: values.name,
    slug: values.slug || undefined,
    description: values.description || null,
    icon: values.icon || null,
    sort_order: values.sort_order,
    is_active: values.is_active,
  }
}

export type FeatureCategoryOption = {
  value: number
  label: string
}

export async function getFeatureCategories(): Promise<FeatureCategory[]> {
  const response = await centralApiClient.get<ApiEnvelope<FeatureCategory[]>>(
    "/feature-categories"
  )
  return response.data
}

export async function getFeatureCategoryOptions(): Promise<
  FeatureCategoryOption[]
> {
  const response = await centralApiClient.get<
    ApiEnvelope<FeatureCategoryOption[]>
  >("/feature-categories/options")
  return response.data
}

export async function createFeatureCategory(
  values: StoreFeatureCategoryFormValues
) {
  const response = await centralApiClient.post<ApiEnvelope<FeatureCategory>>(
    "/feature-categories",
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateFeatureCategory(
  id: number,
  values: UpdateFeatureCategoryFormValues
) {
  const response = await centralApiClient.put<ApiEnvelope<FeatureCategory>>(
    `/feature-categories/${id}`,
    toPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteFeatureCategory(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/feature-categories/${id}`
  )
  return { data: null, message: response.message }
}
