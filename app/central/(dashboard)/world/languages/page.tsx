import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Languages",
  description: "Manage languages in the world catalog.",
}

export default function Page() {
  return <PageClient />
}
