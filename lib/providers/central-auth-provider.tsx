"use client"

import { useGetProfile } from "@/features/central/auth/hooks/use-auth-query"
import type { CentralUser } from "@/types/central/user"
import { createContext, useContext, useMemo } from "react"
import {Permission} from "@/features/central/auth/components/permissions";

type AuthContextType = {
  user: CentralUser | null
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

  const hasPermission = (permission: Permission) => {
    if (isSuperAdmin) {
      return true
    }
    return user?.permissions?.includes(permission) ?? false
  }

  const value = {
    user: user || null,
    isLoading,
    hasPermission,
    isSuperAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useCentralAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useCentralAuth must be used within a CentralAuthProvider")
  }
  return context
}
