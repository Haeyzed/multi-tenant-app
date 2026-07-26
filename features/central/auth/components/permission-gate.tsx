"use client"

import * as React from "react"
import {LockIcon} from "lucide-react"

import {Badge} from "@/components/ui/badge"
import {useCentralAuth} from "@/lib/providers/central-auth-provider"
import {Permission} from "@/features/central/auth/permissions";

type PermissionGateProps = {
    permissions: Permission | Permission[]
    children: React.ReactNode
    fallback?: React.ReactNode
    requireAll?: boolean
}

/**
 * A default lightweight fallback badge if you don't pass a custom fallback prop.
 */
function DefaultAccessDenied() {
    return (
        <div className="flex items-center justify-center p-4">
            <Badge variant="outline" className="text-muted-foreground flex items-center gap-1.5 py-1">
                <LockIcon className="size-3.5"/>
                <span>Access Restricted</span>
            </Badge>
        </div>
    )
}

export function PermissionGate({
                                   permissions,
                                   children,
                                   fallback = <DefaultAccessDenied/>,
                                   requireAll = false,
                               }: PermissionGateProps) {
    const {hasPermission, isSuperAdmin} = useCentralAuth()
    const required = Array.isArray(permissions) ? permissions : [permissions]

    const canAccess =
        isSuperAdmin ||
        (requireAll ? required.every(hasPermission) : required.some(hasPermission))

    if (!canAccess) {
        return <>{fallback}</>
    }

    return <>{children}</>
}