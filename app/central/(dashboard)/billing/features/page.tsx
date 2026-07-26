import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Features",
  description: "Manage plan features and limits.",
}

export default function Page() {
  return <PageClient />
}
