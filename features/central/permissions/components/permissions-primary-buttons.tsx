"use client"

import Link from "next/link"
import { Grid3x3, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { usePermissions } from "@/features/central/permissions/components/permissions-provider"
import { centralRoutes } from "@/features/central/shell/routes"

export function PermissionsPrimaryButtons() {
  const { setOpen } = usePermissions()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <PermissionGate permissions="permissions.view">
        <Button variant="outline" className="gap-1" render={<Link href={centralRoutes.permissionsMatrix} />}>
          <Grid3x3 className="size-4" />
          <span>Open matrix</span>
        </Button>
      </PermissionGate>
      <PermissionGate permissions="permissions.create">
        <Button className="gap-1" onClick={() => setOpen("create")}>
          <span>Create</span>
          <Plus className="size-4" />
        </Button>
      </PermissionGate>
    </div>
  )
}
