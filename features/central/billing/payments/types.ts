import type { PaginatedMeta } from "@/features/central/shared/types"

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "disputed"
  | "cancelled"

export type PaymentGateway = "stripe" | "paystack" | "flutterwave" | string

export type PaymentTenantSummary = {
  id: string
  name: string | null
  slug: string | null
}

export type PaymentInvoiceSummary = {
  id: number
  number: string | null
  status: string | null
}

export type PaymentAttempt = {
  id: number
  attempt_number: number
  status: string | null
  gateway_reference: string | null
  response_message: string | null
  created_at: string | null
}

export type RefundStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"

export type Refund = {
  id: number
  payment_id: number
  tenant_id: string
  amount: string | number
  currency: string
  status: RefundStatus | string
  gateway_reference: string | null
  reason: string | null
  refunded_at: string | null
  created_at: string
}

export type Payment = {
  id: number
  tenant_id: string
  invoice_id: number | null
  subscription_id: number | null
  gateway: PaymentGateway | null
  gateway_label?: string | null
  status: PaymentStatus
  status_label?: string | null
  amount: string | number
  currency: string
  gateway_reference: string | null
  failure_reason: string | null
  checkout_url?: string | null
  paid_at: string | null
  refunded_amount?: string | number | null
  tenant?: PaymentTenantSummary | null
  invoice?: PaymentInvoiceSummary | null
  attempts?: PaymentAttempt[]
  refunds?: Refund[]
  created_at: string
}

export type PaginatedPayments = {
  data: Payment[]
  meta: PaginatedMeta
}

export type PaymentStatistics = {
  total: number
  pending: number
  processing: number
  completed: number
  failed: number
  refunded: number
  volume: number
  by_status: Record<string, number>
  by_gateway: Record<string, number>
}
