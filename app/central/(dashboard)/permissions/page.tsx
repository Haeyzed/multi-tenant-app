"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { PermissionsBulkDialogs } from "@/features/central/permissions/components/permissions-bulk-dialogs"
import { PermissionsDialogs } from "@/features/central/permissions/components/permissions-dialogs"
import { PermissionsPrimaryButtons } from "@/features/central/permissions/components/permissions-primary-buttons"
import { PermissionsProvider } from "@/features/central/permissions/components/permissions-provider"
import { PermissionsStats } from "@/features/central/permissions/components/permissions-stats"
import { PermissionsTable } from "@/features/central/permissions/components/permissions-table"
import { permissions } from "@/features/central/auth/components/permissions"
import { Header } from "@/components/layout/header"
import { ThemeSwitch } from "@/components/theme-switch"
import { ConfigDrawer } from "@/components/config-drawer"
import { Main } from "@/components/layout/main"
import { Search } from "@/components/search"
import { ProfileDropdown } from "@/features/central/shell/profile-dropdown"

export default function PermissionsPage() {
  return (
    <CentralAuthGuard permissions={permissions.users.permissions.view}>
      <PermissionsProvider>
        <Header fixed>
          <Search className="me-auto" />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Permissions"
            description="Manage the platform permission catalog."
          >
            <PermissionsPrimaryButtons />
          </PageHeader>
          <PermissionsStats />
          <PermissionsTable />
          <PermissionsDialogs />
          <PermissionsBulkDialogs />
        </Main>
      </PermissionsProvider>
    </CentralAuthGuard>
  )
}
