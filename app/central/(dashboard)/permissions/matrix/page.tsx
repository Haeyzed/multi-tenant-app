import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Permission matrix",
  description: "Compare role permissions in a matrix view.",
}

export default function Page() {
  return <PageClient />
}
