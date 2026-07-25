"use client"

import {useMemo} from "react"
import {useCentralAuth} from "@/lib/providers/central-auth-provider"
import type {NavCollapsible, NavItem, NavLink, SidebarData,} from "@/components/layout/types"
import type {Permission} from "@/features/central/auth/components/permissions";

export function useFilteredSidebarData(data: SidebarData): SidebarData {
    const {hasPermission, isSuperAdmin} = useCentralAuth()

    return useMemo(() => {
        // Super-admins bypass all filters and see the entire sidebar
        if (isSuperAdmin) {
            return data
        }

        /**
         * Returns true if no permissions are set, or if the user has ANY of the required permissions (OR logic).
         */
        const checkAccess = (itemPermissions?: string[]) => {
            if (!itemPermissions || itemPermissions.length === 0) return true
            return itemPermissions.some((permission) =>
                hasPermission(permission as Permission)
            )
        }

        const filterItems = (items: NavItem[]): NavItem[] => {
            const result: NavItem[] = []

            for (const item of items) {
                // 1. Check if the parent item itself is accessible
                if (!checkAccess(item.permissions)) {
                    continue
                }

                // 2. Handle NavCollapsible (TypeScript narrows this cleanly because 'items' exists)
                if ("items" in item && Array.isArray(item.items)) {
                    const accessibleChildren = item.items.filter((child) =>
                        checkAccess(child.permissions)
                    )

                    // Only include the collapsible dropdown if it still has at least 1 accessible child link
                    if (accessibleChildren.length > 0) {
                        result.push({
                            ...item,
                            items: accessibleChildren,
                        } as NavCollapsible)
                    }
                }
                // 3. Handle NavLink ('url' exists, 'items' is undefined/never)
                else {
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
            // Remove entire navigation groups (e.g., "Billing" or "Users") if all their items were hidden
            .filter((group) => group.items.length > 0)

        return {
            ...data,
            navGroups: filteredGroups,
        }
    }, [data, hasPermission, isSuperAdmin])
}