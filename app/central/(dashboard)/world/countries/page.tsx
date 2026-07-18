"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { CountriesDialogs } from "@/features/central/world/countries/components/countries-dialogs"
import { CountriesPrimaryButtons } from "@/features/central/world/countries/components/countries-primary-buttons"
import { CountriesProvider } from "@/features/central/world/countries/components/countries-provider"
import { CountriesStats } from "@/features/central/world/countries/components/countries-stats"
import { CountriesTable } from "@/features/central/world/countries/components/countries-table"

export default function CountriesPage() {
  return (
    <CentralAuthGuard permissions="world.view">
      <CountriesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Countries"
            description="Manage country reference data used across the platform."
          >
            <CountriesPrimaryButtons />
          </PageHeader>
          <CountriesStats />
          <CountriesTable />
          <CountriesDialogs />
        </div>
      </CountriesProvider>
    </CentralAuthGuard>
  )
}
