/**
 * Central admin URL namespace.
 * Tenant app routes stay outside this prefix (e.g. /* on tenant host).
 */
export const centralRoutes = {
  root: "/central",
  login: "/central/login",
  signup: "/central/signup",
  forgotPassword: "/central/forgot-password",
  resetPassword: "/central/reset-password",
  twoFactor: "/central/two-factor",
  dashboard: "/central/dashboard",
  tenants: "/central/tenants",
  users: "/central/users",
  roles: "/central/roles",
  permissions: "/central/permissions",
  permissionsMatrix: "/central/permissions/matrix",
  monitoring: "/central/monitoring",
  settings: "/central/settings",
  world: {
    root: "/central/world",
    countries: "/central/world/countries",
    states: "/central/world/states",
    cities: "/central/world/cities",
    timezones: "/central/world/timezones",
    languages: "/central/world/languages",
    currencies: "/central/world/currencies",
  },
  billing: {
    root: "/central/billing",
    plans: "/central/billing/plans",
    features: "/central/billing/features",
    featureCategories: "/central/billing/feature-categories",
    subscriptions: "/central/billing/subscriptions",
    invoices: "/central/billing/invoices",
    payments: "/central/billing/payments",
    checkout: "/central/billing/checkout",
    success: "/central/billing/success",
    cancel: "/central/billing/cancel",
  },
} as const

export function billingCheckoutUrl(subscriptionId: string | number): string {
  return `${centralRoutes.billing.checkout}/${subscriptionId}`
}

export function billingInvoicePayUrl(invoiceId: string | number): string {
  return `${centralRoutes.billing.invoices}/${invoiceId}`
}

export type CentralRoute =
  | (typeof centralRoutes)["login"]
  | (typeof centralRoutes)["signup"]
  | (typeof centralRoutes)["forgotPassword"]
  | (typeof centralRoutes)["resetPassword"]
  | (typeof centralRoutes)["twoFactor"]
  | (typeof centralRoutes)["dashboard"]
  | (typeof centralRoutes)["tenants"]
  | (typeof centralRoutes)["users"]
  | (typeof centralRoutes)["roles"]
  | (typeof centralRoutes)["permissions"]
  | (typeof centralRoutes)["permissionsMatrix"]
  | (typeof centralRoutes)["monitoring"]
  | (typeof centralRoutes)["settings"]
  | (typeof centralRoutes.billing)[keyof typeof centralRoutes.billing]
  | (typeof centralRoutes.world)[keyof typeof centralRoutes.world]
