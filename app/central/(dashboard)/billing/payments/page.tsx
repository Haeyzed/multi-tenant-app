"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { PaymentsDialogs } from "@/features/central/billing/payments/components/payments-dialogs"
import { PaymentsProvider } from "@/features/central/billing/payments/components/payments-provider"
import { PaymentsStats } from "@/features/central/billing/payments/components/payments-stats"
import { PaymentsTable } from "@/features/central/billing/payments/components/payments-table"

export default function PaymentsPage() {
  return (
    <CentralAuthGuard permissions="billing.payments.view">
      <PaymentsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Payments"
            description="Review tenant payments and process refunds."
          />
          <PaymentsStats />
          <PaymentsTable />
          <PaymentsDialogs />
        </div>
      </PaymentsProvider>
    </CentralAuthGuard>
  )
}
