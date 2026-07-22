"use client"

import * as React from "react"
import Link from "next/link"
import {useSearchParams} from "next/navigation"

import {buttonVariants} from "@/components/ui/button"
import {Spinner} from "@/components/ui/spinner"
import {centralRoutes} from "@/features/central/shell/routes"
import {confirmPublicBillingSuccess} from "@/lib/services/central/public-billing-service"
import {cn} from "@/lib/utils"

export function BillingSuccessClient() {
    const searchParams = useSearchParams()
    const [message, setMessage] = React.useState("Confirming your payment…")
    const [completed, setCompleted] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const started = React.useRef(false)

    React.useEffect(() => {
        if (started.current) {
            return
        }
        started.current = true

        const payment = searchParams.get("payment") ?? undefined
        const reference =
            searchParams.get("reference") ??
            searchParams.get("trxref") ??
            searchParams.get("transaction_id") ??
            undefined
        const trxref = searchParams.get("trxref") ?? undefined
        const transactionId = searchParams.get("transaction_id") ?? undefined
        const status = searchParams.get("status") ?? undefined

        confirmPublicBillingSuccess({
            payment,
            reference,
            trxref,
            transaction_id: transactionId,
            status,
        })
            .then((result) => {
                setCompleted(Boolean(result.completed))
                setMessage(result.message)
            })
            .catch((error: unknown) => {
                setCompleted(false)
                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Unable to confirm payment yet. If you were charged, contact support."
                )
            })
            .finally(() => setLoading(false))
    }, [searchParams])

    return (
        <div className="space-y-4 text-center">
            {loading ? <Spinner className="mx-auto size-6"/> : null}
            <h1 className="text-xl font-semibold">
                {loading
                    ? "Confirming payment"
                    : completed
                        ? "Payment successful"
                        : "Payment status"}
            </h1>
            <p className="text-muted-foreground text-sm">{message}</p>
            {!loading ? (
                <Link
                    href={centralRoutes.login}
                    className={cn(buttonVariants({variant: "default"}))}
                >
                    Continue
                </Link>
            ) : null}
        </div>
    )
}
