import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Users",
  description: "Manage central platform administrators and staff.",
}

export default function Page() {
  return <PageClient />
}
