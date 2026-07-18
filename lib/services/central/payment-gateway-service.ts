import {

  type ApiEnvelope,

  centralApiClient,

} from "@/lib/api/central-client"



export type PaymentGatewayOption = {

  value: string

  label: string

}



export async function getPaymentGatewayOptions(): Promise<

  PaymentGatewayOption[]

> {

  const response = await centralApiClient.get<

    ApiEnvelope<PaymentGatewayOption[]>

  >("/payment-gateways/options")

  return response.data

}

