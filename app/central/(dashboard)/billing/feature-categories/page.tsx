import type { Metadata } from "next"

import PageClient from "./page-client"

export const metadata: Metadata = {
  title: "Feature categories",
  description: "Organize features into categories.",
}

export default function Page() {
  return <PageClient />
}
