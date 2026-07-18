"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { TimezonesDialogs } from "@/features/central/world/timezones/components/timezones-dialogs"
import { TimezonesPrimaryButtons } from "@/features/central/world/timezones/components/timezones-primary-buttons"
import { TimezonesProvider } from "@/features/central/world/timezones/components/timezones-provider"
import { TimezonesStats } from "@/features/central/world/timezones/components/timezones-stats"
import { TimezonesTable } from "@/features/central/world/timezones/components/timezones-table"

export default function TimezonesPage() {
  return (
    <CentralAuthGuard permissions="world.view">
      <TimezonesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Timezones"
            description="Manage timezone reference data by country."
          >
            <TimezonesPrimaryButtons />
          </PageHeader>
          <TimezonesStats />
          <TimezonesTable />
          <TimezonesDialogs />
        </div>
      </TimezonesProvider>
    </CentralAuthGuard>
  )
}
