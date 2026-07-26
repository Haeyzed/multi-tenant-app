"use client"

import * as React from "react"
import {type Table} from "@tanstack/react-table"
import {PauseCircle, PlayCircle, Trash2} from "lucide-react"

import {ActionBar, ActionBarClose, ActionBarGroup, ActionBarItem, ActionBarSelection,} from "@/components/ui/action-bar"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/permissions"
import {useUsers} from "@/features/central/users/components/users-provider"
import type {CentralUser} from "@/features/central/users/types"

type UsersBulkActionsProps<TData> = {
    table: Table<TData>
}

export function UsersBulkActions<TData>({
                                            table,
                                        }: UsersBulkActionsProps<TData>) {
    const {setOpen, setBulkSelection} = useUsers()
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const onOpenChange = React.useCallback(
        (open: boolean) => {
            if (!open) {
                table.toggleAllRowsSelected(false)
            }
        },
        [table]
    )

    const openBulk = (type: "deleteMany" | "suspendMany" | "activateMany") => {
        setBulkSelection({
            ids: selectedRows.map((row) => (row.original as CentralUser).id),
            onComplete: () => table.resetRowSelection(),
        })
        setOpen(type)
    }

    return (
        <ActionBar open={selectedRows.length > 0} onOpenChange={onOpenChange}>
            <ActionBarGroup>
                <ActionBarSelection>
                    {selectedRows.length} selected
                </ActionBarSelection>
                <PermissionGate permissions={[permissions.users.manageStatus]}>
                    <ActionBarItem onClick={() => openBulk("activateMany")}>
                        <PlayCircle className="size-4"/>
                        Activate
                    </ActionBarItem>
                </PermissionGate>
                <PermissionGate permissions={[permissions.users.manageStatus]}>
                    <ActionBarItem onClick={() => openBulk("suspendMany")}>
                        <PauseCircle className="size-4"/>
                        Suspend
                    </ActionBarItem>
                </PermissionGate>
                <PermissionGate permissions={[permissions.users.delete]}>
                    <ActionBarItem onClick={() => openBulk("deleteMany")}>
                        <Trash2 className="size-4"/>
                        Delete
                    </ActionBarItem>
                </PermissionGate>
            </ActionBarGroup>
            <ActionBarClose/>
        </ActionBar>
    )
}
