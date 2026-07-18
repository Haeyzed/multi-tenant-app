"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { LanguagesDialogs } from "@/features/central/world/languages/components/languages-dialogs"
import { LanguagesPrimaryButtons } from "@/features/central/world/languages/components/languages-primary-buttons"
import { LanguagesProvider } from "@/features/central/world/languages/components/languages-provider"
import { LanguagesStats } from "@/features/central/world/languages/components/languages-stats"
import { LanguagesTable } from "@/features/central/world/languages/components/languages-table"

export default function LanguagesPage() {
  return (
    <CentralAuthGuard permissions="world.view">
      <LanguagesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Languages"
            description="Manage locale language reference data."
          >
            <LanguagesPrimaryButtons />
          </PageHeader>
          <LanguagesStats />
          <LanguagesTable />
          <LanguagesDialogs />
        </div>
      </LanguagesProvider>
    </CentralAuthGuard>
  )
}
