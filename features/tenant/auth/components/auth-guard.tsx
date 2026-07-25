"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import type { Permission } from "@/features/tenant/auth/components/permissions"
import { tenantRoutes } from "@/features/tenant/shell/routes"
import { tenantApiClient } from "@/lib/api/tenant-client"
import { useTenantAuth } from "@/lib/providers/tenant-auth-provider"

export function TenantAuthGuard({
  children,
  permissions,
}: {
  children: React.ReactNode
  permissions?: Permission | Permission[]
}) {
  const { user, isLoading, hasPermission, isStoreOwner } = useTenantAuth()
  const router = useRouter()

  useEffect(() => {
    if (!tenantApiClient.getToken()) {
      router.replace(tenantRoutes.login)
      return
    }

    if (!isLoading && !user) {
      router.replace(tenantRoutes.login)
    }
  }, [user, isLoading, router])

  if (!tenantApiClient.getToken() || isLoading || !user) {
    return null
  }

  if (permissions) {
    const requiredPermissions = Array.isArray(permissions)
      ? permissions
      : [permissions]
    const canAccess =
      isStoreOwner || requiredPermissions.every(hasPermission)

    if (!canAccess) {
      return null
    }
  }

  return <>{children}</>
}
