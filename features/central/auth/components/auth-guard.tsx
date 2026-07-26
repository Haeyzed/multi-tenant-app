"use client"

import {useCentralAuth} from "@/lib/providers/central-auth-provider"
import {centralApiClient} from "@/lib/api/central-client"
import {centralRoutes} from "@/features/central/shell/routes"
import {useRouter} from "next/navigation"
import {useEffect} from "react"
import {Permission} from "@/features/central/auth/permissions";

export function CentralAuthGuard({
                                     children,
                                     permissions,
                                 }: {
    children: React.ReactNode
    permissions?: Permission | Permission[]
}) {
    const {user, isLoading, hasPermission, isSuperAdmin} = useCentralAuth()
    const router = useRouter()

    useEffect(() => {
        if (!centralApiClient.getToken()) {
            router.replace(centralRoutes.login)
            return
        }

        if (!isLoading && !user) {
            router.replace(centralRoutes.login)
        }
    }, [user, isLoading, router])

    if (!centralApiClient.getToken() || isLoading || !user) {
        return null
    }

    if (permissions) {
        const requiredPermissions = Array.isArray(permissions)
            ? permissions
            : [permissions]
        const canAccess = isSuperAdmin || requiredPermissions.every(hasPermission)

        if (!canAccess) {
            return null
        }
    }

    return <>{children}</>
}
