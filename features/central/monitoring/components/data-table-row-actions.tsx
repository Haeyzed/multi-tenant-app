"use client"

import { type Row } from "@tanstack/react-table"
import { Eye, MoreHorizontal, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useMonitoring } from "@/features/central/monitoring/components/monitoring-provider"
import type { FailedJob } from "@/types/central/monitoring"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const failedJob = row.original as FailedJob
  const { setOpen, setCurrentRow } = useMonitoring()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="flex size-8 p-0">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        <PermissionGate permissions="monitoring.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(failedJob)
              setOpen("viewException")
            }}
          >
            <Eye className="mr-2 size-4" />
            View exception
          </DropdownMenuItem>
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="monitoring.manage">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(failedJob)
              setOpen("retry")
            }}
          >
            <RotateCcw className="mr-2 size-4" />
            Retry
          </DropdownMenuItem>
        </PermissionGate>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
