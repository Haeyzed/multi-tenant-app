"use client"



import * as React from "react"

import Link from "next/link"

import { useRouter } from "next/navigation"



import { buttonVariants } from "@/components/ui/button"

import { Spinner } from "@/components/ui/spinner"

import { centralRoutes } from "@/features/central/shell/routes"

import { startPublicCheckout } from "@/lib/services/central/public-billing-service"

import { cn } from "@/lib/utils"



type CheckoutClientProps = {

  subscriptionId: number

  expires: string | null

  signature: string | null

}



type CheckoutState =

  | { status: "loading" }

  | { status: "redirecting" }

  | { status: "completed"; paymentId: number }

  | { status: "error"; message: string }



export function CheckoutClient({

  subscriptionId,

  expires,

  signature,

}: CheckoutClientProps) {

  const router = useRouter()

  const [state, setState] = React.useState<CheckoutState>({ status: "loading" })

  const started = React.useRef(false)



  React.useEffect(() => {

    if (started.current) {

      return

    }

    started.current = true



    if (!expires || !signature) {

      setState({

        status: "error",

        message: "This checkout link is missing a valid signature.",

      })

      return

    }



    startPublicCheckout(subscriptionId, { expires, signature })

      .then((result) => {

        if (result.completed) {

          setState({ status: "completed", paymentId: result.payment_id })

          router.replace(

            `${centralRoutes.billing.success}?payment=${result.payment_id}`

          )

          return

        }



        if (result.checkout_url) {

          setState({ status: "redirecting" })

          window.location.assign(result.checkout_url)

          return

        }



        setState({

          status: "error",

          message: "The payment gateway did not return a checkout URL.",

        })

      })

      .catch((error: unknown) => {

        const message =

          error instanceof Error

            ? error.message

            : "Unable to start checkout. The link may have expired."

        setState({ status: "error", message })

      })

  }, [expires, router, signature, subscriptionId])



  if (state.status === "error") {

    return (

      <div className="space-y-4 text-center">

        <h1 className="text-xl font-semibold">Checkout unavailable</h1>

        <p className="text-muted-foreground text-sm">{state.message}</p>

        <Link

          href={centralRoutes.login}

          className={cn(buttonVariants({ variant: "default" }))}

        >

          Go to login

        </Link>

      </div>

    )

  }



  return (

    <div className="flex flex-col items-center gap-3 text-center">

      <Spinner className="size-6" />

      <h1 className="text-xl font-semibold">

        {state.status === "completed"

          ? "Payment completed"

          : state.status === "redirecting"

            ? "Redirecting to payment…"

            : "Preparing checkout…"}

      </h1>

      <p className="text-muted-foreground text-sm">

        Please wait while we connect you to the payment provider.

      </p>

    </div>

  )

}


