import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Countries",
  description: "Manage countries in the world catalog.",
}

export default function Page() {
  return <PageClient />
}
