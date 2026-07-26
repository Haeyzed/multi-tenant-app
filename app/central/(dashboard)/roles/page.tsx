import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Roles",
  description: "Create roles and assign permissions.",
}

export default function Page() {
  return <PageClient />
}
