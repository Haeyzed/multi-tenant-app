"use client"

import * as React from "react"
import Link from "next/link"
import {useParams, useSearchParams} from "next/navigation"

import {buttonVariants} from "@/components/ui/button"
import {Spinner} from "@/components/ui/spinner"
import {usePublicSignupComplete} from "@/features/central/auth/hooks/use-signup-query"
import {centralRoutes} from "@/features/central/shell/routes"
import {cn} from "@/lib/utils"
import type {PublicSignupResult} from "@/types/central/signup"

function tenantLoginUrl(domain: string | null): string | null {
    if (!domain) {
        return null
    }
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
        return domain
    }
    return `https://${domain}`
}

export function SignupCompleteClient() {
    const params = useParams<{ intent: string }>()
    const searchParams = useSearchParams()
    const completeMutation = usePublicSignupComplete()
    const [result, setResult] = React.useState<PublicSignupResult | null>(null)
    const [error, setError] = React.useState<string | null>(null)
    const started = React.useRef(false)

    React.useEffect(() => {
        if (started.current) {
            return
        }
        started.current = true

        const intentId = params.intent
        if (!intentId) {
            setError("Missing signup session.")
            return
        }

        completeMutation.mutate(
            {
                signup_intent_id: intentId,
                session_id: searchParams.get("session_id") ?? undefined,
                trxref: searchParams.get("trxref") ?? undefined,
                reference: searchParams.get("reference") ?? undefined,
                transaction_id: searchParams.get("transaction_id") ?? undefined,
                id: searchParams.get("id") ?? undefined,
            },
            {
                onSuccess: (data) => setResult(data),
                onError: (err) => {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to complete signup. Your card may not have been verified."
                    )
                },
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.intent])

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-2xl font-bold">Signup incomplete</h1>
                <p className="text-muted-foreground text-sm">{error}</p>
                <Link
                    href={centralRoutes.signup}
                    className={cn(buttonVariants({variant: "default"}))}
                >
                    Try again
                </Link>
            </div>
        )
    }

    if (!result) {
        return (
            <div className="flex flex-col items-center gap-3 text-center">
                <Spinner className="size-6"/>
                <h1 className="text-xl font-semibold">Finishing signup…</h1>
                <p className="text-muted-foreground text-sm">
                    Confirming your card and creating your workspace.
                </p>
            </div>
        )
    }

    const loginUrl = tenantLoginUrl(result.login.primary_domain)

    return (
        <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-bold">You are all set</h1>
            <p className="text-muted-foreground text-sm">
                {result.login.message ||
                    "Your trial has started. Your card was verified and will not be charged until the trial ends."}
            </p>
            {loginUrl ? (
                <a
                    href={loginUrl}
                    className={cn(buttonVariants({variant: "default"}))}
                >
                    Go to your workspace
                </a>
            ) : (
                <Link
                    href={centralRoutes.login}
                    className={cn(buttonVariants({variant: "default"}))}
                >
                    Go to login
                </Link>
            )}
        </div>
    )
}
