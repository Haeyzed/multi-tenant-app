"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useUsers } from "@/features/central/users/components/users-provider"

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()

  return (
    <PermissionGate permissions="users.create">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
