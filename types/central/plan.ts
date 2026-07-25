export type PlanStatus = "draft" | "active" | "inactive" | "archived"

export type PlanVisibility = "public" | "private" | "hidden"

export type BillingInterval =
  | "free"
  | "trial"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "lifetime"
  | "enterprise"

export type PlanPriceInterval = "monthly" | "quarterly" | "yearly"

export type FeatureLimitType =
  | "unlimited"
  | "count"
  | "storage"
  | "bandwidth"
  | "periodic"
  | "boolean"

export type PlanPrice = {
  id: number
  plan_id: number
  amount: string | number
  currency: string
  billing_interval: PlanPriceInterval | null
  billing_interval_label?: string | null
  trial_days: number | null
  status: PlanStatus | null
  status_label?: string | null
  metadata?: Record<string, unknown> | null
  gateway_identifiers?: {
    stripe?: string | null
    paystack?: string | null
    flutterwave?: string | null
    [key: string]: string | null | undefined
  } | null
  created_at?: string | null
  updated_at?: string | null
}

export type Plan = {
  id: number
  name: string
  slug: string
  description: string | null
  price: string | number
  currency: string
  billing_interval: BillingInterval | null
  billing_interval_label?: string | null
  trial_days: number
  status: PlanStatus
  status_label?: string | null
  visibility: PlanVisibility
  visibility_label?: string | null
  is_featured: boolean
  is_publicly_visible?: boolean
  sort_order: number
  metadata?: Record<string, unknown> | null
  features_count?: number
  features?: PlanFeature[]
  prices?: PlanPrice[]
  resolved_price?: PlanPrice | null
  created_at: string
  created_at_human?: string | null
  updated_at?: string | null
  updated_at_human?: string | null
  deleted_at?: string | null
}

export type PlanFeaturePivot = {
  id?: number
  limit_type: FeatureLimitType | string | null
  limit_value: number | null
  is_unlimited: boolean
  is_enabled: boolean
  tracks_usage: boolean
  reset_period?: string | null
}

export type PlanFeature = {
  id: number
  name: string
  slug: string
  key: string
  description?: string | null
  default_limit_type?: FeatureLimitType | string | null
  default_limit_value?: number | null
  unit?: string | null
  tracks_usage?: boolean
  pivot?: PlanFeaturePivot | null
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

export type PaginatedPlans = {
  data: Plan[]
  meta: PaginatedMeta
}

export type PlanStatistics = {
  total: number
  draft: number
  active: number
  inactive: number
  archived: number
  public: number
  featured: number
  by_status: Record<string, number>
  by_visibility: Record<string, number>
}
