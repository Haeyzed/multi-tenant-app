import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"

export type PaymentGatewayOption = {
  value: string
  label: string
}

export type PaymentGatewayConfigSummary = {
  id: number
  environment: "test" | "live" | string
  public_key: string | null
  has_secret_key: boolean
  has_webhook_secret: boolean
  is_active: boolean
}

export type PaymentGatewayCatalogItem = {
  id?: number
  name: string
  slug: string
  driver: string
  priority?: number
  is_active?: boolean
  is_fallback?: boolean
  supports_refunds?: boolean
  supports_recurring?: boolean
  supports_webhook?: boolean
  supports_partial_refund?: boolean
  currencies?: string[]
  countries?: string[]
  configs?: PaymentGatewayConfigSummary[]
  source?: "catalog" | "driver"
}

export type UpdatePaymentGatewayConfigPayload = {
  environment: "test" | "live"
  public_key?: string | null
  secret_key?: string | null
  webhook_secret?: string | null
  is_active?: boolean
}

export async function getPaymentGatewayOptions(): Promise<
  PaymentGatewayOption[]
> {
  const response = await centralApiClient.get<
    ApiEnvelope<PaymentGatewayOption[]>
  >("/payment-gateways/options")
  return response.data
}

export async function getPaymentGateways(): Promise<PaymentGatewayCatalogItem[]> {
  const response = await centralApiClient.get<
    ApiEnvelope<PaymentGatewayCatalogItem[]>
  >("/payment-gateways")
  return response.data
}

export async function updatePaymentGatewayConfig(
  slug: string,
  payload: UpdatePaymentGatewayConfigPayload
): Promise<ApiEnvelope<unknown>> {
  return centralApiClient.put<ApiEnvelope<unknown>>(
    `/payment-gateways/${slug}/config`,
    payload
  )
}
