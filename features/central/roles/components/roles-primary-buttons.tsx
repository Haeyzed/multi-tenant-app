"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useRoles } from "@/features/central/roles/components/roles-provider"

export function RolesPrimaryButtons() {
    const { setOpen } = useRoles()

    return (
        <PermissionGate permissions="roles.create">
            <Button className="gap-1" onClick={() => setOpen("create")}>
                <span>Create</span>
                <Plus className="size-4" />
            </Button>
        </PermissionGate>
    )
}
