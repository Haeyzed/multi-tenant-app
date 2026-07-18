"use client"

import { type Row } from "@tanstack/react-table"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useCurrenciesContext } from "@/features/central/world/currencies/components/currencies-provider"
import type { Currency } from "@/types/central/world"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const currency = row.original as Currency
  const { setOpen, setCurrentRow } = useCurrenciesContext()

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
        <PermissionGate permissions="world.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(currency)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 size-4" />
            View
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="world.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(currency)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="world.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(currency)
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
