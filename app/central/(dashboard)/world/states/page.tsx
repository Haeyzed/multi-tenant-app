import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "States",
  description: "Manage states and provinces.",
}

export default function Page() {
  return <PageClient />
}
