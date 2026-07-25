import { getTenantSubdomainFromHost } from "@/lib/tenant-host"

const TOKEN_KEY = "tenant_token"

export function resolveTenantApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_TENANT_API_URL) {
    return process.env.NEXT_PUBLIC_TENANT_API_URL.replace(/\/$/, "")
  }

  const apiBaseDomain =
    process.env.NEXT_PUBLIC_TENANT_API_BASE_DOMAIN ??
    process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN ??
    "multi-tenant-api.test"

  if (typeof window === "undefined") {
    return `http://${apiBaseDomain}/api/v1`
  }

  const subdomain = getTenantSubdomainFromHost(window.location.host)

  if (subdomain) {
    return `http://${subdomain}.${apiBaseDomain}/api/v1`
  }

  return `http://${apiBaseDomain}/api/v1`
}

export { TOKEN_KEY as TENANT_TOKEN_KEY }
