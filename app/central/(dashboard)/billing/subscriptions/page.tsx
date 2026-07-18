"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { SubscriptionsDialogs } from "@/features/central/billing/subscriptions/components/subscriptions-dialogs"
import { SubscriptionsPrimaryButtons } from "@/features/central/billing/subscriptions/components/subscriptions-primary-buttons"
import { SubscriptionsProvider } from "@/features/central/billing/subscriptions/components/subscriptions-provider"
import { SubscriptionsStats } from "@/features/central/billing/subscriptions/components/subscriptions-stats"
import { SubscriptionsTable } from "@/features/central/billing/subscriptions/components/subscriptions-table"

export default function SubscriptionsPage() {
  return (
    <CentralAuthGuard permissions="subscriptions.view">
      <SubscriptionsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Subscriptions"
            description="Manage tenant subscription lifecycles."
          >
            <SubscriptionsPrimaryButtons />
          </PageHeader>
          <SubscriptionsStats />
          <SubscriptionsTable />
          <SubscriptionsDialogs />
        </div>
      </SubscriptionsProvider>
    </CentralAuthGuard>
  )
}
