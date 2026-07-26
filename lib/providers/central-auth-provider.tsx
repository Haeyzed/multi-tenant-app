"use client"

import { useGetProfile } from "@/features/central/auth/hooks/use-auth-query"
import type { User } from "@/features/central/users/types"
import { createContext, useCallback, useContext, useMemo } from "react"
import {Permission} from "@/features/central/auth/permissions";

type AuthContextType = {
  user: User | null
  isLoading: boolean
  hasPermission: (permission: Permission) => boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function CentralAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, isLoading } = useGetProfile()

  const isSuperAdmin = useMemo(() => {
    return user?.roles?.includes("super-admin") ?? false
  }, [user])

  const hasPermission = useCallback(
    (permission: Permission) => {
      if (isSuperAdmin) {
        return true
      }
      return user?.permissions?.includes(permission) ?? false
    },
    [isSuperAdmin, user?.permissions]
  )

  const value = useMemo(
    () => ({
      user: user || null,
      isLoading,
      hasPermission,
      isSuperAdmin,
    }),
    [user, isLoading, hasPermission, isSuperAdmin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useCentralAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useCentralAuth must be used within a CentralAuthProvider")
  }
  return context
}
