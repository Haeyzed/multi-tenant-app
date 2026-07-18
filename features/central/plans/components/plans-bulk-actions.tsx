"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { Archive, PlayCircle, Trash2 } from "lucide-react"

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
} from "@/components/ui/action-bar"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { usePlans } from "@/features/central/plans/components/plans-provider"
import type { Plan } from "@/types/central/plan"

type PlansBulkActionsProps<TData> = {
  table: Table<TData>
}

export function PlansBulkActions<TData>({
  table,
}: PlansBulkActionsProps<TData>) {
  const { setOpen, setBulkSelection } = usePlans()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table]
  )

  const openBulk = (type: "deleteMany" | "activateMany" | "archiveMany") => {
    setBulkSelection({
      ids: selectedRows.map((row) => (row.original as Plan).id),
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
        <PermissionGate permissions="plans.update">
          <ActionBarItem onClick={() => openBulk("activateMany")}>
            <PlayCircle className="size-4" />
            Activate
          </ActionBarItem>
        </PermissionGate>
        <PermissionGate permissions="plans.update">
          <ActionBarItem onClick={() => openBulk("archiveMany")}>
            <Archive className="size-4" />
            Archive
          </ActionBarItem>
        </PermissionGate>
        <PermissionGate permissions="plans.delete">
          <ActionBarItem onClick={() => openBulk("deleteMany")}>
            <Trash2 className="size-4" />
            Delete
          </ActionBarItem>
        </PermissionGate>
      </ActionBarGroup>
      <ActionBarClose />
    </ActionBar>
  )
}
