"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { FeaturesDialogs } from "@/features/central/billing/features/components/features-dialogs"
import { FeaturesPrimaryButtons } from "@/features/central/billing/features/components/features-primary-buttons"
import { FeaturesProvider } from "@/features/central/billing/features/components/features-provider"
import { FeaturesTable } from "@/features/central/billing/features/components/features-table"

export default function FeaturesPage() {
  return (
    <CentralAuthGuard permissions="features.view">
      <FeaturesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Features"
            description="Manage billable features tenants can access."
          >
            <FeaturesPrimaryButtons />
          </PageHeader>
          <FeaturesTable />
          <FeaturesDialogs />
        </div>
      </FeaturesProvider>
    </CentralAuthGuard>
  )
}
