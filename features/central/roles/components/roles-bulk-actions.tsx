"use client"

import * as React from "react"
import {type Table} from "@tanstack/react-table"
import {Trash2} from "lucide-react"

import {ActionBar, ActionBarClose, ActionBarGroup, ActionBarItem, ActionBarSelection,} from "@/components/ui/action-bar"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {useRoles} from "@/features/central/roles/components/roles-provider"
import type {CentralRole} from "@/types/central/rbac"

const SUPER_ADMIN_ROLE = "super-admin"

type RolesBulkActionsProps<TData> = {
    table: Table<TData>
}

export function RolesBulkActions<TData>({table}: RolesBulkActionsProps<TData>) {
    const {setOpen, setBulkSelection} = useRoles()
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const onOpenChange = React.useCallback(
        (open: boolean) => {
            if (!open) {
                table.toggleAllRowsSelected(false)
            }
        },
        [table]
    )

    const openBulkDelete = () => {
        const ids = selectedRows
            .map((row) => row.original as CentralRole)
            .filter((role) => role.name !== SUPER_ADMIN_ROLE)
            .map((role) => role.id)

        if (ids.length === 0) {
            return
        }

        setBulkSelection({
            ids,
            onComplete: () => table.resetRowSelection(),
        })
        setOpen("deleteMany")
    }

    return (
        <ActionBar open={selectedRows.length > 0} onOpenChange={onOpenChange}>
            <ActionBarGroup>
                <ActionBarSelection>
                    {selectedRows.length} selected
                </ActionBarSelection>
                <PermissionGate permissions="roles.delete">
                    <ActionBarItem onClick={openBulkDelete}>
                        <Trash2 className="size-4"/>
                        Delete
                    </ActionBarItem>
                </PermissionGate>
            </ActionBarGroup>
            <ActionBarClose/>
        </ActionBar>
    )
}
