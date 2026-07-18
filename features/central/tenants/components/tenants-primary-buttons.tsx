"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useTenants } from "@/features/central/tenants/components/tenants-provider"

export function TenantsPrimaryButtons() {
  const { setOpen } = useTenants()

  return (
    <PermissionGate permissions="tenants.create">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
