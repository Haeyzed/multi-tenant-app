const CENTRAL_HOSTS = new Set(["localhost", "127.0.0.1"])

export function getHostnameFromHost(host: string): string {
  return host.split(":")[0].toLowerCase()
}

function getConfiguredBaseDomain(): string | null {
  const base =
    process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN?.trim() ||
    process.env.NEXT_PUBLIC_TENANT_API_BASE_DOMAIN?.trim() ||
    ""

  return base ? base.toLowerCase() : null
}

/**
 * Returns the tenant subdomain when the request is on a tenant host
 * (e.g. acme.localhost or acme.multi-tenant-api.test), or null for
 * the central platform host.
 */
export function getTenantSubdomainFromHost(host: string): string | null {
  const hostname = getHostnameFromHost(host)

  if (CENTRAL_HOSTS.has(hostname)) {
    return null
  }

  const baseDomain = getConfiguredBaseDomain()
  if (baseDomain && (hostname === baseDomain || hostname === `www.${baseDomain}`)) {
    return null
  }

  if (baseDomain && hostname.endsWith(`.${baseDomain}`)) {
    const subdomain = hostname.slice(0, -(baseDomain.length + 1))
    if (!subdomain || subdomain.includes(".") || subdomain === "www") {
      return null
    }
    return subdomain
  }

  const parts = hostname.split(".")

  if (parts.length < 2 || !parts[0] || parts[0] === "www") {
    return null
  }

  // Fallback for local *.localhost FE hosts while API uses another base domain.
  if (parts.length === 2 && parts[1] === "localhost") {
    return parts[0]
  }

  return null
}
