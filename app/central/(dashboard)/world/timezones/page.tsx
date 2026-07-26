import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Timezones",
  description: "Manage timezones in the world catalog.",
}

export default function Page() {
  return <PageClient />
}
