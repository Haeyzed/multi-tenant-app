import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Payments",
  description: "Track payments and refunds.",
}

export default function Page() {
  return <PageClient />
}
