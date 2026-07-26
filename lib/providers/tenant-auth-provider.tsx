"use client"

import { useGetProfile } from "@/features/tenant/auth/hooks/use-auth-query"
import type { Permission } from "@/features/tenant/auth/permissions"
import type { TenantUser } from "@/types/tenant/user"
import { createContext, useContext, useMemo } from "react"

type AuthContextType = {
  user: TenantUser | null
  isLoading: boolean
  hasPermission: (permission: Permission) => boolean
  isStoreOwner: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function TenantAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, isLoading } = useGetProfile()

  const isStoreOwner = useMemo(() => {
    return user?.roles?.includes("store-owner") ?? false
  }, [user])

  const hasPermission = (permission: Permission) => {
    if (isStoreOwner) {
      return true
    }
    return user?.permissions?.includes(permission) ?? false
  }

  const value = {
    user: user || null,
    isLoading,
    hasPermission,
    isStoreOwner,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useTenantAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useTenantAuth must be used within a TenantAuthProvider")
  }
  return context
}
