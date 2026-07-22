"use client"

import {type Row} from "@tanstack/react-table"
import {Edit, Eye, MoreHorizontal, Trash2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {useFeatures} from "@/features/central/billing/features/components/features-provider"
import type {Feature} from "@/types/central/feature"

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
                <PermissionGate permissions="features.view">
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
                <PermissionGate permissions="features.update">
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
                <PermissionGate permissions="features.delete">
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
