"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { TenantsBulkDialogs } from "@/features/central/tenants/components/tenants-bulk-dialogs"
import { TenantsDialogs } from "@/features/central/tenants/components/tenants-dialogs"
import { TenantsPrimaryButtons } from "@/features/central/tenants/components/tenants-primary-buttons"
import { TenantsProvider } from "@/features/central/tenants/components/tenants-provider"
import { TenantsStats } from "@/features/central/tenants/components/tenants-stats"
import { TenantsTable } from "@/features/central/tenants/components/tenants-table"

export default function TenantsPage() {
  return (
    <CentralAuthGuard permissions="tenants.view">
      <TenantsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Tenants"
            description="Manage and monitor all tenants across your platform."
          >
            <TenantsPrimaryButtons />
          </PageHeader>
          <TenantsStats />
          <TenantsTable />
          <TenantsDialogs />
          <TenantsBulkDialogs />
        </div>
      </TenantsProvider>
    </CentralAuthGuard>
  )
}
