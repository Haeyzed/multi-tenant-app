import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type { Invoice } from "@/types/central/invoice"
import type { Payment } from "@/types/central/payment"

export type PublicCheckoutResult = {
  checkout_url: string | null
  completed: boolean
  payment_id: number
  invoice_id: number
  subscription_id: number
}

export type PublicBillingReturnResult = {
  completed?: boolean
  message: string
  payment: Payment | null
}

export type PublicInvoiceGatewayOption = {
  value: string
  label: string
  recommended: boolean
}

export type PublicInvoiceShowResult = {
  invoice: Invoice
  gateways: PublicInvoiceGatewayOption[]
  can_pay: boolean
}

export type PublicInvoicePayResult = {
  checkout_url: string | null
  completed: boolean
  payment_id: number
  invoice_id: number
  payment: Payment
}

/**
 * Call the signed public checkout API.
 * Only pass expires + signature from the email link — extra query params
 * invalidate Laravel's signed URL hash.
 */
export async function startPublicCheckout(
  subscriptionId: number,
  params: { expires: string; signature: string }
): Promise<PublicCheckoutResult> {
  const response = await centralApiClient.get<
    ApiEnvelope<PublicCheckoutResult>
  >(`/public/billing/checkout/${subscriptionId}`, {
    expires: params.expires,
    signature: params.signature,
  })
  return response.data
}

export async function getPublicInvoice(
  invoiceId: number,
  params: { expires: string; signature: string }
): Promise<PublicInvoiceShowResult> {
  const response = await centralApiClient.get<
    ApiEnvelope<PublicInvoiceShowResult>
  >(`/public/billing/invoices/${invoiceId}`, {
    expires: params.expires,
    signature: params.signature,
  })
  return response.data
}

export async function payPublicInvoice(
  invoiceId: number,
  gateway: string,
  params: { expires: string; signature: string }
): Promise<PublicInvoicePayResult> {
  const query = new URLSearchParams({
    expires: params.expires,
    signature: params.signature,
  }).toString()

  const response = await centralApiClient.post<
    ApiEnvelope<PublicInvoicePayResult>
  >(`/public/billing/invoices/${invoiceId}/pay?${query}`, { gateway })
  return response.data
}

export async function confirmPublicBillingSuccess(params: {
  payment?: string
  reference?: string
  trxref?: string
  transaction_id?: string
  status?: string
}): Promise<PublicBillingReturnResult> {
  const response = await centralApiClient.get<
    ApiEnvelope<PublicBillingReturnResult>
  >("/public/billing/success", params)
  return response.data
}

export async function confirmPublicBillingCancel(params: {
  payment?: string
}): Promise<PublicBillingReturnResult> {
  const response = await centralApiClient.get<
    ApiEnvelope<PublicBillingReturnResult>
  >("/public/billing/cancel", params)
  return response.data
}
