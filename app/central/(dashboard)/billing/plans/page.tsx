import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Plans",
  description: "Manage subscription plans and pricing.",
}

export default function Page() {
  return <PageClient />
}
