import type { Invoice } from "@/types/central/invoice"
import type { Plan, PlanPrice } from "@/types/central/plan"

export type SubscriptionStatus =
  | "pending"
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "paused"
  | "expired"
  | "unpaid"

export type SubscriptionBillingInterval =
  | "free"
  | "trial"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "lifetime"
  | "enterprise"

export type SubscriptionGateway = "stripe" | "paystack" | "flutterwave" | string

export type SubscriptionTenantSummary = {
  id: string
  name: string | null
  slug: string | null
}

export type SubscriptionHistory = {
  id: number
  event: string
  from_status: SubscriptionStatus | null
  to_status: SubscriptionStatus | null
  from_plan_id: number | null
  to_plan_id: number | null
  user_id: number | null
  meta?: Record<string, unknown> | null
  created_at: string
}

export type Subscription = {
  id: number
  tenant_id: string
  plan_id: number
  plan_price_id?: number | null
  status: SubscriptionStatus
  status_label?: string | null
  billing_interval: SubscriptionBillingInterval | null
  price: string | number
  currency: string
  gateway: SubscriptionGateway | null
  trial_ends_at: string | null
  starts_at: string | null
  current_period_start: string | null
  current_period_end: string | null
  paused_at: string | null
  cancelled_at: string | null
  cancel_at_period_end: boolean
  grace_ends_at: string | null
  is_in_grace_period: boolean
  cancellation_reason: string | null
  tenant?: SubscriptionTenantSummary | null
  plan?: Plan | null
  plan_price?: PlanPrice | null
  histories?: SubscriptionHistory[]
  invoices?: Invoice[]
  created_at: string
  updated_at?: string | null
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

export type PaginatedSubscriptions = {
  data: Subscription[]
  meta: PaginatedMeta
}

export type SubscriptionStatistics = {
  total: number
  active: number
  trialing: number
  past_due: number
  cancelled: number
  paused: number
  by_status: Record<string, number>
  by_gateway: Record<string, number>
}
