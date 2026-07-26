"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Spinner } from "@/components/ui/spinner"
import { useRedeemImpersonation } from "@/features/tenant/auth/hooks/use-auth-query"
import { tenantRoutes } from "@/features/tenant/shell/routes"

export function ImpersonateRedeem() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const redeem = useRedeemImpersonation()
  const started = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || started.current) {
      return
    }
    started.current = true

    redeem.mutate(token, {
      onSuccess: () => {
        router.replace(tenantRoutes.dashboard)
      },
      onError: (err) => {
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Impersonation failed"
        )
      },
    })
  }, [token, router]) // eslint-disable-line react-hooks/exhaustive-deps -- run once per token


  if (!token) {
    return (
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Invalid impersonation link</h1>
        <p className="text-sm text-muted-foreground">
          This link is missing a token. Start impersonation from the central
          tenants screen.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Impersonation failed</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Spinner className="size-6" />
      <h1 className="text-2xl font-bold">Starting impersonation…</h1>
      <p className="text-sm text-muted-foreground">
        Exchanging your central token for a store session.
      </p>
    </div>
  )
}
