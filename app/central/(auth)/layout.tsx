import type { Metadata } from "next"

import { AuthLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: {
    default: "Sign in",
    template: "%s · Central",
  },
  description: "Central platform authentication.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>
}
