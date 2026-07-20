"use client"

import Link from "next/link"
import { Grid3x3, LockIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { permissions } from "@/features/central/auth/components/permissions"
import { usePermissions } from "@/features/central/permissions/components/permissions-provider"
import { centralRoutes } from "@/features/central/shell/routes"

export function PermissionsPrimaryButtons() {
    const { setOpen } = usePermissions()

    return (
        <div className="flex flex-wrap items-center gap-2">
            <PermissionGate
                permissions={[permissions.permissions.view]}
                fallback={
                    <Button disabled variant="outline" className="gap-1 opacity-60">
                        <LockIcon className="size-3.5" />
                        <span>Open matrix</span>
                    </Button>
                }
            >
                <Button variant="outline" className="gap-1" render={<Link href={centralRoutes.permissionsMatrix} />}>
                    <Grid3x3 className="size-4" />
                    <span>Open matrix</span>
                </Button>
            </PermissionGate>

            <PermissionGate
                permissions={[permissions.permissions.create]}
                fallback={
                    <Button disabled variant="outline" className="gap-1 opacity-60">
                        <LockIcon className="size-3.5" />
                        <span>Create</span>
                    </Button>
                }
            >
                <Button className="gap-1" onClick={() => setOpen("create")}>
                    <span>Create</span>
                    <Plus className="size-4" />
                </Button>
            </PermissionGate>
        </div>
    )
}