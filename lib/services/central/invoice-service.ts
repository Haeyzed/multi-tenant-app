import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  Invoice,
  InvoiceStatistics,
  PaginatedInvoices,
} from "@/features/central/billing/invoices/types"
import type { Payment } from "@/features/central/billing/payments/types"
import type { PaginatedMeta } from "@/features/central/shared/types"

export async function getInvoices(
  params?: {
    tenant_id?: string
    status?: string
    subscription_id?: number
    search?: string
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<PaginatedInvoices> {
  const response = await centralApiClient.get<
    ApiEnvelope<Invoice[]> & { meta?: PaginatedMeta }
  >("/invoices", params, { signal })

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

export async function getInvoiceStatistics(): Promise<InvoiceStatistics> {
  const response = await centralApiClient.get<ApiEnvelope<InvoiceStatistics>>(
    "/invoices/statistics"
  )
  return response.data
}

export async function getInvoice(id: number): Promise<Invoice> {
  const response = await centralApiClient.get<ApiEnvelope<Invoice>>(
    `/invoices/${id}`
  )
  return response.data
}

export async function createInvoice(values: {
  tenant_id: string
  subscription_id?: number | null
  tax_rate?: number
  tax_id?: string
  currency?: string
  notes?: string
  items: { description: string; quantity?: number; unit_price: number }[]
}) {
  const response = await centralApiClient.post<ApiEnvelope<Invoice>>(
    "/invoices",
    values
  )
  return { data: response.data, message: response.message }
}

export async function voidInvoice(id: number) {
  const response = await centralApiClient.post<ApiEnvelope<Invoice>>(
    `/invoices/${id}/void`,
    {}
  )
  return { data: response.data, message: response.message }
}

export async function chargeInvoice(
  id: number,
  values?: { gateway?: string; amount?: number }
) {
  const response = await centralApiClient.post<ApiEnvelope<Payment>>(
    `/invoices/${id}/charge`,
    values ?? {}
  )
  return { data: response.data, message: response.message }
}

export async function sendInvoicePaymentLink(
  id: number,
  values?: { email?: string }
) {
  const response = await centralApiClient.post<
    ApiEnvelope<{ email: string; payment_url: string }>
  >(`/invoices/${id}/send-payment-link`, values ?? {})
  return { data: response.data, message: response.message }
}
