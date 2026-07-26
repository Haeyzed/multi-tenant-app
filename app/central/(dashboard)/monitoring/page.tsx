import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Monitoring",
  description: "Inspect queues, failed jobs, and platform health.",
}

export default function Page() {
  return <PageClient />
}
