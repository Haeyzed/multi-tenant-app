"use client"

import { ConfigDrawer } from "@/components/config-drawer"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { TenantAuthGuard } from "@/features/tenant/auth/components/auth-guard"
import { permissions } from "@/features/tenant/auth/components/permissions"
import { ProfileDropdown } from "@/features/tenant/shell/profile-dropdown"

export default function TenantDashboardPage() {
  return (
    <TenantAuthGuard permissions={[permissions.dashboard.view]}>
      <Header>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Welcome to your store admin.
            </p>
          </div>
        </div>
      </Main>
    </TenantAuthGuard>
  )
}
