"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { FeatureCategoriesDialogs } from "@/features/central/billing/feature-categories/components/feature-categories-dialogs"
import { FeatureCategoriesPrimaryButtons } from "@/features/central/billing/feature-categories/components/feature-categories-primary-buttons"
import { FeatureCategoriesProvider } from "@/features/central/billing/feature-categories/components/feature-categories-provider"
import { FeatureCategoriesTable } from "@/features/central/billing/feature-categories/components/feature-categories-table"

export default function FeatureCategoriesPage() {
  return (
    <CentralAuthGuard permissions="features.view">
      <FeatureCategoriesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Feature categories"
            description="Group related features for easier management."
          >
            <FeatureCategoriesPrimaryButtons />
          </PageHeader>
          <FeatureCategoriesTable />
          <FeatureCategoriesDialogs />
        </div>
      </FeatureCategoriesProvider>
    </CentralAuthGuard>
  )
}
