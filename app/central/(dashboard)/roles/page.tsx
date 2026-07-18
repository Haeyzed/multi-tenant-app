"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { RolesBulkDialogs } from "@/features/central/roles/components/roles-bulk-dialogs"
import { RolesDialogs } from "@/features/central/roles/components/roles-dialogs"
import { RolesPrimaryButtons } from "@/features/central/roles/components/roles-primary-buttons"
import { RolesProvider } from "@/features/central/roles/components/roles-provider"
import { RolesStats } from "@/features/central/roles/components/roles-stats"
import { RolesTable } from "@/features/central/roles/components/roles-table"

export default function RolesPage() {
  return (
    <CentralAuthGuard permissions="roles.view">
      <RolesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Roles"
            description="Manage platform roles and their permissions."
          >
            <RolesPrimaryButtons />
          </PageHeader>
          <RolesStats />
          <RolesTable />
          <RolesDialogs />
          <RolesBulkDialogs />
        </div>
      </RolesProvider>
    </CentralAuthGuard>
  )
}
