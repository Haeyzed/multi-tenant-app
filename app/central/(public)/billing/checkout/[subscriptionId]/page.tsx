import type { Metadata } from "next"
import {BillingCheckoutClient} from "@/features/central/billing/checkout/components/billing-checkout-client"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your subscription payment.",
}

type CheckoutPageProps = {
    params: Promise<{ subscriptionId: string }>
    searchParams: Promise<{ expires?: string; signature?: string }>
}

export default async function PublicCheckoutPage({
                                                     params,
                                                     searchParams,
                                                 }: CheckoutPageProps) {

    const {subscriptionId} = await params
    const query = await searchParams
    const id = Number(subscriptionId)

    return (
        <BillingCheckoutClient
            subscriptionId={Number.isFinite(id) ? id : 0}
            expires={query.expires ?? null}
            signature={query.signature ?? null}
        />
    )
}

