"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { SettingsTabs } from "@/features/central/settings/components/settings-tabs"

export default function SettingsPage() {
  return (
    <CentralAuthGuard permissions="settings.view">
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <PageHeader
          title="Settings"
          description="Configure platform-wide settings, including billing gateways and currencies."
        />
        <SettingsTabs />
      </div>
    </CentralAuthGuard>
  )
}
