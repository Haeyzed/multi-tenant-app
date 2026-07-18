"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { PlansBulkDialogs } from "@/features/central/plans/components/plans-bulk-dialogs"
import { PlansDialogs } from "@/features/central/plans/components/plans-dialogs"
import { PlansPrimaryButtons } from "@/features/central/plans/components/plans-primary-buttons"
import { PlansProvider } from "@/features/central/plans/components/plans-provider"
import { PlansStats } from "@/features/central/plans/components/plans-stats"
import { PlansTable } from "@/features/central/plans/components/plans-table"

export default function PlansPage() {
  return (
    <CentralAuthGuard permissions="plans.view">
      <PlansProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Plans"
            description="Configure billing plans available to tenants."
          >
            <PlansPrimaryButtons />
          </PageHeader>
          <PlansStats />
          <PlansTable />
          <PlansDialogs />
          <PlansBulkDialogs />
        </div>
      </PlansProvider>
    </CentralAuthGuard>
  )
}
