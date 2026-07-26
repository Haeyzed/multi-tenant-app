"use client"

import { LockIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Permission } from "@/features/tenant/auth/permissions"
import { useTenantAuth } from "@/lib/providers/tenant-auth-provider"

type PermissionGateProps = {
  permissions: Permission | Permission[]
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAll?: boolean
}

function DefaultAccessDenied() {
  return (
    <div className="flex items-center justify-center p-4">
      <Badge
        variant="outline"
        className="text-muted-foreground flex items-center gap-1.5 py-1"
      >
        <LockIcon className="size-3.5" />
        <span>Access Restricted</span>
      </Badge>
    </div>
  )
}

export function PermissionGate({
  permissions,
  children,
  fallback = <DefaultAccessDenied />,
  requireAll = false,
}: PermissionGateProps) {
  const { hasPermission, isStoreOwner } = useTenantAuth()
  const required = Array.isArray(permissions) ? permissions : [permissions]

  const canAccess =
    isStoreOwner ||
    (requireAll
      ? required.every(hasPermission)
      : required.some(hasPermission))

  if (!canAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
