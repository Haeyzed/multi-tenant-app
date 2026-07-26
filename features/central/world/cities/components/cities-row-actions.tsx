"use client"

import {type Row} from "@tanstack/react-table"
import {Edit, Eye, LockIcon, MoreHorizontal, Trash2} from "lucide-react"

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
import {useCities} from "@/features/central/world/cities/components/cities-provider"
import type {City} from "@/types/central/world"

type DataTableRowActionsProps<TData> = {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    const city = row.original as City
    const {setOpen, setCurrentRow} = useCities()

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
            <DropdownMenuContent align="end" className="w-48">
                <PermissionGate
                    permissions={[permissions.world.view]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            View
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(city)
                            setOpen("view")
                        }}
                    >
                        <Eye className="mr-2 size-4"/>
                        View
                    </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate
                    permissions={[permissions.world.update]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Edit
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(city)
                            setOpen("update")
                        }}
                    >
                        <Edit className="mr-2 size-4"/>
                        Edit
                    </DropdownMenuItem>
                </PermissionGate>
                <DropdownMenuSeparator/>
                <PermissionGate
                    permissions={[permissions.world.delete]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Delete
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                            setCurrentRow(city)
                            setOpen("delete")
                        }}
                    >
                        <Trash2 className="mr-2 size-4"/>
                        Delete
                    </DropdownMenuItem>
                </PermissionGate>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
