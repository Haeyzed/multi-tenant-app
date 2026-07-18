"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { CitiesDialogs } from "@/features/central/world/cities/components/cities-dialogs"
import { CitiesPrimaryButtons } from "@/features/central/world/cities/components/cities-primary-buttons"
import { CitiesProvider } from "@/features/central/world/cities/components/cities-provider"
import { CitiesStats } from "@/features/central/world/cities/components/cities-stats"
import { CitiesTable } from "@/features/central/world/cities/components/cities-table"

export default function CitiesPage() {
  return (
    <CentralAuthGuard permissions="world.view">
      <CitiesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Cities"
            description="Manage city reference data by state and country."
          >
            <CitiesPrimaryButtons />
          </PageHeader>
          <CitiesStats />
          <CitiesTable />
          <CitiesDialogs />
        </div>
      </CitiesProvider>
    </CentralAuthGuard>
  )
}
