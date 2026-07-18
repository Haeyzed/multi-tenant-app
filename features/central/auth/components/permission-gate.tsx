"use client"

import { useCentralAuth } from "@/lib/providers/central-auth-provider"

export function PermissionGate({
  permissions,
  children,
}: {
  permissions: string | string[]
  children: React.ReactNode
}) {
  const { hasPermission, isSuperAdmin } = useCentralAuth()
  const required = Array.isArray(permissions) ? permissions : [permissions]
  const canAccess = isSuperAdmin || required.every(hasPermission)

  if (!canAccess) {
    return null
  }

  return <>{children}</>
}
