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
import {useFeatures} from "@/features/central/billing/features/components/features-provider"
import type {Feature} from "@/features/central/billing/features/types"

type DataTableRowActionsProps<TData> = {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    const feature = row.original as Feature
    const {setOpen, setCurrentRow} = useFeatures()

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
                    permissions={[permissions.features.view]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            View
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(feature)
                            setOpen("view")
                        }}
                    >
                        <Eye className="mr-2 size-4"/>
                        View
                    </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate
                    permissions={[permissions.features.update]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Edit
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(feature)
                            setOpen("update")
                        }}
                    >
                        <Edit className="mr-2 size-4"/>
                        Edit
                    </DropdownMenuItem>
                </PermissionGate>
                <DropdownMenuSeparator/>
                <PermissionGate
                    permissions={[permissions.features.delete]}
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
                            setCurrentRow(feature)
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
