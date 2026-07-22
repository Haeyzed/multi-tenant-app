"use client"

import * as React from "react"
import {type Table} from "@tanstack/react-table"
import {PauseCircle, PlayCircle, Trash2} from "lucide-react"

import {ActionBar, ActionBarClose, ActionBarGroup, ActionBarItem, ActionBarSelection,} from "@/components/ui/action-bar"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/components/permissions"
import {useTenants} from "@/features/central/tenants/components/tenants-provider"
import type {Tenant} from "@/types/central/tenant"

type TenantsBulkActionsProps<TData> = {
    table: Table<TData>
}

export function TenantsBulkActions<TData>({
                                              table,
                                          }: TenantsBulkActionsProps<TData>) {
    const {setOpen, setBulkSelection} = useTenants()
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
            ids: selectedRows.map((row) => (row.original as Tenant).id),
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
                <PermissionGate permissions={[permissions.tenants.update]}>
                    <ActionBarItem onClick={() => openBulk("activateMany")}>
                        <PlayCircle className="size-4"/>
                        Activate
                    </ActionBarItem>
                </PermissionGate>
                <PermissionGate permissions={[permissions.tenants.update]}>
                    <ActionBarItem onClick={() => openBulk("suspendMany")}>
                        <PauseCircle className="size-4"/>
                        Suspend
                    </ActionBarItem>
                </PermissionGate>
                <PermissionGate permissions={[permissions.tenants.delete]}>
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