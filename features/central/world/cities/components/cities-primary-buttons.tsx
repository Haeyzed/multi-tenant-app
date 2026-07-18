"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useCitiesContext } from "@/features/central/world/cities/components/cities-provider"

export function CitiesPrimaryButtons() {
  const { setOpen } = useCitiesContext()

  return (
    <PermissionGate permissions="world.create">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
