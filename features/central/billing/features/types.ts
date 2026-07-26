import type { FeatureCategory } from "@/features/central/billing/feature-categories/types"
import type { PaginatedMeta } from "@/features/central/shared/types"

export type FeatureStatus = "active" | "inactive" | "deprecated"

export type FeatureLimitType =
  | "unlimited"
  | "count"
  | "storage"
  | "bandwidth"
  | "periodic"
  | "boolean"

export type Feature = {
  id: number
  feature_category_id: number | null
  name: string
  slug: string
  key: string
  description: string | null
  icon: string | null
  status: FeatureStatus
  status_label?: string | null
  default_limit_type: FeatureLimitType | null
  default_limit_value: number | null
  unit: string | null
  is_available: boolean
  tracks_usage: boolean
  sort_order: number
  metadata?: Record<string, unknown> | null
  category?: FeatureCategory | null
  created_at: string
  created_at_human?: string | null
  updated_at?: string | null
  updated_at_human?: string | null
  deleted_at?: string | null
}

export type PaginatedFeatures = {
  data: Feature[]
  meta: PaginatedMeta
}
