/**
 * Base domain shown as a preview suffix on tenant subdomain inputs
 * (e.g. multi-tenant-api.test). Not joined into submitted values.
 */
export function getTenantBaseDomain(): string {
  return (
    process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN?.trim() ||
    "multi-tenant-api.test"
  )
}
