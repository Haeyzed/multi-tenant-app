"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { usePlans } from "@/features/central/plans/components/plans-provider"

export function PlansPrimaryButtons() {
  const { setOpen } = usePlans()

  return (
    <PermissionGate permissions="plans.create">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
