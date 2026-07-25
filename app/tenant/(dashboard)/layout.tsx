"use client"

import { DashboardShell } from "@/components/layout/dashboard-shell"
import { TenantAuthGuard } from "@/features/tenant/auth/components/auth-guard"
import { AppSidebar } from "@/features/tenant/shell/app-sidebar"
import { CommandMenu } from "@/features/tenant/shell/command-menu"
import { TenantAuthProvider } from "@/lib/providers/tenant-auth-provider"

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TenantAuthProvider>
      <DashboardShell
        sidebar={<AppSidebar />}
        commandMenu={<CommandMenu />}
      >
        <TenantAuthGuard>{children}</TenantAuthGuard>
      </DashboardShell>
    </TenantAuthProvider>
  )
}
