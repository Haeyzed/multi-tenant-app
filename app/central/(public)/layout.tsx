import type { Metadata } from "next"

import { PublicBillingLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: {
    default: "Billing",
    template: "%s · Central",
  },
  description: "Public billing pages for the central platform.",
}

export default function PublicBillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicBillingLayoutClient>{children}</PublicBillingLayoutClient>
}
