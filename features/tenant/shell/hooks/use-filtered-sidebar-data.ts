"use client"

import { useMemo } from "react"

import type {
  NavCollapsible,
  NavItem,
  NavLink,
  SidebarData,
} from "@/components/layout/types"
import type { Permission } from "@/features/tenant/auth/permissions"
import { useTenantAuth } from "@/lib/providers/tenant-auth-provider"

export function useFilteredSidebarData(data: SidebarData): SidebarData {
  const { hasPermission, isStoreOwner } = useTenantAuth()

  return useMemo(() => {
    if (isStoreOwner) {
      return data
    }

    const checkAccess = (itemPermissions?: string[]) => {
      if (!itemPermissions || itemPermissions.length === 0) return true
      return itemPermissions.some((permission) =>
        hasPermission(permission as Permission)
      )
    }

    const filterItems = (items: NavItem[]): NavItem[] => {
      const result: NavItem[] = []

      for (const item of items) {
        if (!checkAccess(item.permissions)) {
          continue
        }

        if ("items" in item && Array.isArray(item.items)) {
          const accessibleChildren = item.items.filter((child) =>
            checkAccess(child.permissions)
          )

          if (accessibleChildren.length > 0) {
            result.push({
              ...item,
              items: accessibleChildren,
            } as NavCollapsible)
          }
        } else {
          result.push(item as NavLink)
        }
      }

      return result
    }

    const filteredGroups = data.navGroups
      .filter((group) => checkAccess(group.permissions))
      .map((group) => ({
        ...group,
        items: filterItems(group.items),
      }))
      .filter((group) => group.items.length > 0)

    return {
      ...data,
      navGroups: filteredGroups,
    }
  }, [data, hasPermission, isStoreOwner])
}
