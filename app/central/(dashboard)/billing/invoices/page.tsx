"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { InvoicesDialogs } from "@/features/central/billing/invoices/components/invoices-dialogs"
import { InvoicesPrimaryButtons } from "@/features/central/billing/invoices/components/invoices-primary-buttons"
import { InvoicesProvider } from "@/features/central/billing/invoices/components/invoices-provider"
import { InvoicesStats } from "@/features/central/billing/invoices/components/invoices-stats"
import { InvoicesTable } from "@/features/central/billing/invoices/components/invoices-table"

export default function InvoicesPage() {
  return (
    <CentralAuthGuard permissions="billing.invoices.view">
      <InvoicesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Invoices"
            description="Manage tenant invoices and billing."
          >
            <InvoicesPrimaryButtons />
          </PageHeader>
          <InvoicesStats />
          <InvoicesTable />
          <InvoicesDialogs />
        </div>
      </InvoicesProvider>
    </CentralAuthGuard>
  )
}
