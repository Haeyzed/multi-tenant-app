"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useStatesContext } from "@/features/central/world/states/components/states-provider"

export function StatesPrimaryButtons() {
  const { setOpen } = useStatesContext()

  return (
    <PermissionGate permissions="world.create">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
