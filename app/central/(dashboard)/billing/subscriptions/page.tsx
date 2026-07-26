import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Manage tenant subscription lifecycles.",
}

export default function Page() {
  return <PageClient />
}
