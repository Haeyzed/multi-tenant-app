import { CheckoutClient } from "@/features/central/billing/checkout/components/checkout-client"



type CheckoutPageProps = {

  params: Promise<{ subscriptionId: string }>

  searchParams: Promise<{ expires?: string; signature?: string }>

}



export default async function PublicCheckoutPage({

  params,

  searchParams,

}: CheckoutPageProps) {

  const { subscriptionId } = await params

  const query = await searchParams

  const id = Number(subscriptionId)



  return (

    <CheckoutClient

      subscriptionId={Number.isFinite(id) ? id : 0}

      expires={query.expires ?? null}

      signature={query.signature ?? null}

    />

  )

}

