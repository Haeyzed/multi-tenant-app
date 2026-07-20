"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { PaymentsDialogs } from "@/features/central/billing/payments/components/payments-dialogs"
import { PaymentsProvider } from "@/features/central/billing/payments/components/payments-provider"
import { PaymentsStats } from "@/features/central/billing/payments/components/payments-stats"
import { PaymentsTable } from "@/features/central/billing/payments/components/payments-table"
import { permissions } from "@/features/central/auth/components/permissions"
import { Header } from "@/components/layout/header"
import { ThemeSwitch } from "@/components/theme-switch"
import { ConfigDrawer } from "@/components/config-drawer"
import { Main } from "@/components/layout/main"
import { Search } from "@/components/search"
import { ProfileDropdown } from "@/features/central/shell/profile-dropdown"

export default function PaymentsPage() {
  return (
    <CentralAuthGuard permissions={permissions.billing.payments.view}>
      <PaymentsProvider>
        <Header fixed>
          <Search className="me-auto" />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Payments"
            description="Review tenant payments and process refunds."
          />
          <PaymentsStats />
          <PaymentsTable />
          <PaymentsDialogs />
        </Main>
      </PaymentsProvider>
    </CentralAuthGuard>
  )
}
