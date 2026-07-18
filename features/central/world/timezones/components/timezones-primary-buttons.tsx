"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useTimezonesContext } from "@/features/central/world/timezones/components/timezones-provider"

export function TimezonesPrimaryButtons() {
  const { setOpen } = useTimezonesContext()

  return (
    <PermissionGate permissions="world.create">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
