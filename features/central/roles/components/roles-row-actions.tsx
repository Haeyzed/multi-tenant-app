"use client"

import {type Row} from "@tanstack/react-table"
import {Edit, Eye, LockIcon, MoreHorizontal, Shield, Trash2,} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/permissions"
import {useRoles} from "@/features/central/roles/components/roles-provider"
import type {CentralRole} from "@/features/central/roles/types"

type DataTableRowActionsProps<TData> = {
    row: Row<TData>
}

const SUPER_ADMIN_ROLE = "super-admin"

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    const role = row.original as CentralRole
    const {setOpen, setCurrentRow} = useRoles()
    const isSuperAdmin = role.name === SUPER_ADMIN_ROLE

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" className="flex size-8 p-0">
                        <MoreHorizontal className="size-4"/>
                        <span className="sr-only">Open menu</span>
                    </Button>
                }
            />
            <DropdownMenuContent align="end" className="w-52">
                <PermissionGate
                    permissions={[permissions.roles.view]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            View
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(role)
                            setOpen("view")
                        }}
                    >
                        <Eye className="mr-2 size-4"/>
                        View
                    </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate
                    permissions={[permissions.roles.update]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Edit
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(role)
                            setOpen("update")
                        }}
                    >
                        <Edit className="mr-2 size-4"/>
                        Edit
                    </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate
                    permissions={[permissions.roles.assignPermissions]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Manage permissions
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(role)
                            setOpen("assignPermissions")
                        }}
                    >
                        <Shield className="mr-2 size-4"/>
                        Manage permissions
                    </DropdownMenuItem>
                </PermissionGate>
                <DropdownMenuSeparator/>
                <PermissionGate
                    permissions={[permissions.roles.delete]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Delete
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        variant="destructive"
                        disabled={isSuperAdmin}
                        onClick={() => {
                            if (isSuperAdmin) {
                                return
                            }
                            setCurrentRow(role)
                            setOpen("delete")
                        }}
                    >
                        <Trash2 className="mr-2 size-4"/>
                        {isSuperAdmin ? "Delete (protected)" : "Delete"}
                    </DropdownMenuItem>
                </PermissionGate>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
