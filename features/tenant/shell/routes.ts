/**
 * Tenant admin URL namespace — mirrors centralRoutes under /tenant.
 */
export const tenantRoutes = {
  root: "/tenant",
  login: "/tenant/login",
  setupPassword: "/tenant/setup-password",
  impersonate: "/tenant/impersonate",
  dashboard: "/tenant/dashboard",
} as const

export type TenantRoute = (typeof tenantRoutes)[keyof typeof tenantRoutes]
