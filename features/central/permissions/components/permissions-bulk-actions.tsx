"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
} from "@/components/ui/action-bar"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { permissions } from "@/features/central/auth/components/permissions"
import { usePermissions } from "@/features/central/permissions/components/permissions-provider"
import type { PermissionItem } from "@/types/central/rbac"

type PermissionsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function PermissionsBulkActions<TData>({
                                                table,
                                              }: PermissionsBulkActionsProps<TData>) {
  const { setOpen, setBulkSelection } = usePermissions()
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
    setBulkSelection({
      ids: selectedRows.map((row) => (row.original as PermissionItem).id),
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
          <PermissionGate permissions={[permissions.users.permissions.delete]}>
            <ActionBarItem onClick={openBulkDelete}>
              <Trash2 className="size-4" />
              Delete
            </ActionBarItem>
          </PermissionGate>
        </ActionBarGroup>
        <ActionBarClose />
      </ActionBar>
  )
}