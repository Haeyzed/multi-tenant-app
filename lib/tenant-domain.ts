/**
 * Base domain for tenant hostnames (must match API TENANT_BASE_DOMAIN
 * and rows in domains.domain, e.g. softmax.multi-tenant-api.test).
 */
export function getTenantBaseDomain(): string {
  return (
    process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN?.trim() ||
    "multi-tenant-api.test"
  )
}

/**
 * Build a full tenant hostname from a subdomain segment.
 * Leaves full hostnames (already containing a dot) unchanged.
 */
export function toTenantHostname(subdomainOrDomain: string): string {
  const value = subdomainOrDomain.trim().toLowerCase()
  if (!value) {
    return value
  }
  if (value.includes(".")) {
    return value
  }
  return `${value}.${getTenantBaseDomain()}`
}
