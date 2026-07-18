"use client"

import { useGetProfile } from "@/features/central/auth/hooks/use-auth-query"
import { centralRoutes } from "@/features/central/shell/routes"
import { centralApiClient } from "@/lib/api/central-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function CentralGuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const hasToken = !!centralApiClient.getToken()
  const { data: user, isLoading, isError } = useGetProfile()

  useEffect(() => {
    if (hasToken && !isLoading && user) {
      router.replace(centralRoutes.dashboard)
    }
  }, [hasToken, isLoading, user, router])

  useEffect(() => {
    if (hasToken && isError) {
      centralApiClient.setToken(null)
    }
  }, [hasToken, isError])

  if (hasToken && (isLoading || user)) {
    return null
  }

  return <>{children}</>
}
