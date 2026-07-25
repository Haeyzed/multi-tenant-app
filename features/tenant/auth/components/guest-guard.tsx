"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useGetProfile } from "@/features/tenant/auth/hooks/use-auth-query"
import { tenantRoutes } from "@/features/tenant/shell/routes"
import { tenantApiClient } from "@/lib/api/tenant-client"

export function TenantGuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const hasToken = !!tenantApiClient.getToken()
  const { data: user, isLoading, isError } = useGetProfile()

  useEffect(() => {
    if (hasToken && !isLoading && user) {
      router.replace(tenantRoutes.dashboard)
    }
  }, [hasToken, isLoading, user, router])

  useEffect(() => {
    if (hasToken && isError) {
      tenantApiClient.setToken(null)
    }
  }, [hasToken, isError])

  if (hasToken && (isLoading || user)) {
    return null
  }

  return <>{children}</>
}
