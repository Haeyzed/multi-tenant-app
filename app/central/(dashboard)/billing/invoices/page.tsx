import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Invoices",
  description: "Create and manage tenant invoices.",
}

export default function Page() {
  return <PageClient />
}
