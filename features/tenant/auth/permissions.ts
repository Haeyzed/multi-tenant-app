/**
 * Tenant permission registry — mirrors Spatie permission names used by
 * tenant admin modules. Store owners bypass checks via isStoreOwner.
 */
export const permissions = {
  dashboard: {
    view: "dashboard.view",
  },
  brands: {
    view: "brands.view",
    create: "brands.create",
    update: "brands.update",
    delete: "brands.delete",
  },
  products: {
    view: "products.view",
    create: "products.create",
    update: "products.update",
    delete: "products.delete",
  },
  settings: {
    view: "settings.view",
    update: "settings.update",
  },
  users: {
    view: "users.view",
    create: "users.create",
    update: "users.update",
    delete: "users.delete",
  },
  roles: {
    view: "roles.view",
    create: "roles.create",
    update: "roles.update",
    delete: "roles.delete",
  },
} as const

type PermissionGroups = typeof permissions

export type Permission = {
  [G in keyof PermissionGroups]: PermissionGroups[G][keyof PermissionGroups[G]]
}[keyof PermissionGroups]
