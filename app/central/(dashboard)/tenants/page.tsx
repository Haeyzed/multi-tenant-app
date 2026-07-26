import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Tenants",
  description: "Manage and monitor all tenants across your platform.",
}

export default function Page() {
  return <PageClient />
}
