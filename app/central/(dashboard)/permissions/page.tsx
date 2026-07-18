"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { PermissionsBulkDialogs } from "@/features/central/permissions/components/permissions-bulk-dialogs"
import { PermissionsDialogs } from "@/features/central/permissions/components/permissions-dialogs"
import { PermissionsPrimaryButtons } from "@/features/central/permissions/components/permissions-primary-buttons"
import { PermissionsProvider } from "@/features/central/permissions/components/permissions-provider"
import { PermissionsStats } from "@/features/central/permissions/components/permissions-stats"
import { PermissionsTable } from "@/features/central/permissions/components/permissions-table"

export default function PermissionsPage() {
  return (
    <CentralAuthGuard permissions="permissions.view">
      <PermissionsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Permissions"
            description="Manage the platform permission catalog."
          >
            <PermissionsPrimaryButtons />
          </PageHeader>
          <PermissionsStats />
          <PermissionsTable />
          <PermissionsDialogs />
          <PermissionsBulkDialogs />
        </div>
      </PermissionsProvider>
    </CentralAuthGuard>
  )
}
