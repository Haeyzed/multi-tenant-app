import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Permissions",
  description: "Browse and manage platform permissions.",
}

export default function Page() {
  return <PageClient />
}
