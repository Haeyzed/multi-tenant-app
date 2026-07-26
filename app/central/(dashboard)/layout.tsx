import type { Metadata } from "next"

import { DashboardLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: {
    default: "Central",
    template: "%s · Central",
  },
  description: "Central multi-tenant platform administration.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
