"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { centralRoutes } from "@/features/central/shell/routes"
import { confirmPublicBillingCancel } from "@/lib/services/central/public-billing-service"
import { cn } from "@/lib/utils"

export function BillingCancelClient() {
  const searchParams = useSearchParams()
  const [message, setMessage] = React.useState(
    "Checkout was cancelled. You can retry from your invoice email when ready."
  )
  const [loading, setLoading] = React.useState(true)
  const started = React.useRef(false)

  React.useEffect(() => {
    if (started.current) {
      return
    }
    started.current = true

    const payment = searchParams.get("payment") ?? undefined

    confirmPublicBillingCancel({ payment })
      .then((result) => {
        setMessage(result.message)
      })
      .catch(() => {
        setMessage(
          payment
            ? `Payment #${payment} was not completed. You can retry from your invoice email when ready.`
            : "Checkout was cancelled. You can retry from your invoice email when ready."
        )
      })
      .finally(() => setLoading(false))
  }, [searchParams])

  return (
    <div className="space-y-4 text-center">
      {loading ? <Spinner className="mx-auto size-6" /> : null}
      <h1 className="text-xl font-semibold">Payment cancelled</h1>
      <p className="text-muted-foreground text-sm">{message}</p>
      {!loading ? (
        <Link
          href={centralRoutes.login}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Back to login
        </Link>
      ) : null}
    </div>
  )
}
