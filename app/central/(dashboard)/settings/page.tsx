"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { SettingsTabs } from "@/features/central/settings/components/settings-tabs"
import { permissions } from "@/features/central/auth/components/permissions"
import { Header } from "@/components/layout/header"
import { ThemeSwitch } from "@/components/theme-switch"
import { ConfigDrawer } from "@/components/config-drawer"
import { Main } from "@/components/layout/main"
import { Search } from "@/components/search"
import { ProfileDropdown } from "@/features/central/shell/profile-dropdown"

export default function SettingsPage() {
  return (
    <CentralAuthGuard permissions={permissions.platform.settings.view}>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <PageHeader
          title="Settings"
          description="Configure platform-wide settings, including billing gateways and currencies."
        />
        <SettingsTabs />
      </Main>
    </CentralAuthGuard>
  )
}
