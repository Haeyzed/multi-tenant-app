"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { CurrenciesDialogs } from "@/features/central/world/currencies/components/currencies-dialogs"
import { CurrenciesPrimaryButtons } from "@/features/central/world/currencies/components/currencies-primary-buttons"
import { CurrenciesProvider } from "@/features/central/world/currencies/components/currencies-provider"
import { CurrenciesStats } from "@/features/central/world/currencies/components/currencies-stats"
import { CurrenciesTable } from "@/features/central/world/currencies/components/currencies-table"

export default function CurrenciesPage() {
  return (
    <CentralAuthGuard permissions="world.view">
      <CurrenciesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Currencies"
            description="Manage currency reference data by country."
          >
            <CurrenciesPrimaryButtons />
          </PageHeader>
          <CurrenciesStats />
          <CurrenciesTable />
          <CurrenciesDialogs />
        </div>
      </CurrenciesProvider>
    </CentralAuthGuard>
  )
}
