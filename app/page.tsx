import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { centralRoutes } from "@/features/central/shell/routes"
import { tenantRoutes } from "@/features/tenant/shell/routes"
import { getTenantSubdomainFromHost } from "@/lib/tenant-host"

export default async function Page() {
  const host = (await headers()).get("host") ?? ""
  const subdomain = getTenantSubdomainFromHost(host)

  if (subdomain) {
    redirect(tenantRoutes.login)
  }

  redirect(centralRoutes.login)
}
