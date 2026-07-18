"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { StatesDialogs } from "@/features/central/world/states/components/states-dialogs"
import { StatesPrimaryButtons } from "@/features/central/world/states/components/states-primary-buttons"
import { StatesProvider } from "@/features/central/world/states/components/states-provider"
import { StatesStats } from "@/features/central/world/states/components/states-stats"
import { StatesTable } from "@/features/central/world/states/components/states-table"

export default function StatesPage() {
  return (
    <CentralAuthGuard permissions="world.view">
      <StatesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="States"
            description="Manage state and province reference data by country."
          >
            <StatesPrimaryButtons />
          </PageHeader>
          <StatesStats />
          <StatesTable />
          <StatesDialogs />
        </div>
      </StatesProvider>
    </CentralAuthGuard>
  )
}
