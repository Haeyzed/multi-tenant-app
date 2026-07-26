import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure platform settings.",
}

export default function Page() {
  return <PageClient />
}
