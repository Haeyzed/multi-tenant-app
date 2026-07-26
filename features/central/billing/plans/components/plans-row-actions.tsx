"use client"

import {type Row} from "@tanstack/react-table"
import {Archive, Edit, Eye, LockIcon, MoreHorizontal, PlayCircle, Trash2,} from "lucide-react"

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
import {usePlans} from "@/features/central/billing/plans/components/plans-provider"
import type {Plan} from "@/types/central/plan"

type DataTableRowActionsProps<TData> = {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    const plan = row.original as Plan
    const {setOpen, setCurrentRow} = usePlans()

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
                    permissions={[permissions.plans.view]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            View
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(plan)
                            setOpen("view")
                        }}
                    >
                        <Eye className="mr-2 size-4"/>
                        View
                    </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate
                    permissions={[permissions.plans.update]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Edit
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(plan)
                            setOpen("update")
                        }}
                    >
                        <Edit className="mr-2 size-4"/>
                        Edit
                    </DropdownMenuItem>
                </PermissionGate>
                <DropdownMenuSeparator/>
                <PermissionGate
                    permissions={[permissions.plans.update]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            {plan.status === "active" ? "Archive" : "Activate"}
                        </DropdownMenuItem>
                    }
                >
                    {plan.status === "active" ? (
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentRow(plan)
                                setOpen("archive")
                            }}
                        >
                            <Archive className="mr-2 size-4"/>
                            Archive
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentRow(plan)
                                setOpen("activate")
                            }}
                        >
                            <PlayCircle className="mr-2 size-4"/>
                            Activate
                        </DropdownMenuItem>
                    )}
                </PermissionGate>
                <DropdownMenuSeparator/>
                <PermissionGate
                    permissions={[permissions.plans.delete]}
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
                            setCurrentRow(plan)
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
