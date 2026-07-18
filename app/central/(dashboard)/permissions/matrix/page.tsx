"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { PermissionMatrixPanel } from "@/features/central/permissions/components/permission-matrix-panel"
import { centralRoutes } from "@/features/central/shell/routes"

export default function PermissionMatrixPage() {
  return (
    <CentralAuthGuard permissions="permissions.view">
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-0"
            render={<Link href={centralRoutes.permissions} />}
          >
            <ArrowLeft className="size-4" />
            Back to permissions
          </Button>
          <PageHeader
            title="Permission matrix"
            description="Review and edit role permissions across the catalog."
          />
        </div>
        <PermissionMatrixPanel />
      </div>
    </CentralAuthGuard>
  )
}
