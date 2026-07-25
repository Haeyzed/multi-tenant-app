/**
 * Tenant permission registry — expand as modules are added.
 */
export const permissions = {
  dashboard: {
    view: "dashboard.view",
  },
} as const

type PermissionGroups = typeof permissions

export type Permission = {
  [G in keyof PermissionGroups]: PermissionGroups[G][keyof PermissionGroups[G]]
}[keyof PermissionGroups]
