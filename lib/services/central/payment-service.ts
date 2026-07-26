import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  PaginatedMeta,
  PaginatedPayments,
  Payment,
  PaymentStatistics,
  Refund,
} from "@/types/central/payment"

export async function getPayments(
  params?: {
    tenant_id?: string
    status?: string
    gateway?: string
    search?: string
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<PaginatedPayments> {
  const response = await centralApiClient.get<
    ApiEnvelope<Payment[]> & { meta?: PaginatedMeta }
  >("/payments", params, { signal })

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

export async function getPaymentStatistics(): Promise<PaymentStatistics> {
  const response = await centralApiClient.get<ApiEnvelope<PaymentStatistics>>(
    "/payments/statistics"
  )
  return response.data
}

export async function getPayment(id: number): Promise<Payment> {
  const response = await centralApiClient.get<ApiEnvelope<Payment>>(
    `/payments/${id}`
  )
  return response.data
}

export async function refundPayment(
  id: number,
  values?: { amount?: number; reason?: string }
) {
  const response = await centralApiClient.post<ApiEnvelope<Refund>>(
    `/payments/${id}/refund`,
    values ?? {}
  )
  return { data: response.data, message: response.message }
}
