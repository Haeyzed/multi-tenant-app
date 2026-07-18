"use client"

import { type Row } from "@tanstack/react-table"
import {
  Archive,
  Edit,
  Eye,
  MoreHorizontal,
  PlayCircle,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { usePlans } from "@/features/central/plans/components/plans-provider"
import type { Plan } from "@/types/central/plan"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const plan = row.original as Plan
  const { setOpen, setCurrentRow } = usePlans()

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
        <PermissionGate permissions="plans.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(plan)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 size-4" />
            View
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="plans.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(plan)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="plans.update">
          {plan.status === "active" ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(plan)
                setOpen("archive")
              }}
            >
              <Archive className="mr-2 size-4" />
              Archive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(plan)
                setOpen("activate")
              }}
            >
              <PlayCircle className="mr-2 size-4" />
              Activate
            </DropdownMenuItem>
          )}
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="plans.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(plan)
              setOpen("delete")
            }}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </PermissionGate>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
