"use client"

import { type Row } from "@tanstack/react-table"
import {
  Edit,
  Eye,
  MoreHorizontal,
  PauseCircle,
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
import { useTenants } from "@/features/central/tenants/components/tenants-provider"
import type { Tenant } from "@/types/central/tenant"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const tenant = row.original as Tenant
  const { setOpen, setCurrentRow } = useTenants()

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
        <PermissionGate permissions="tenants.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tenant)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 size-4" />
            View
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="tenants.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tenant)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="tenants.update">
          {tenant.status === "active" || tenant.status === "trial" ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(tenant)
                setOpen("suspend")
              }}
            >
              <PauseCircle className="mr-2 size-4" />
              Suspend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(tenant)
                setOpen("activate")
              }}
            >
              <PlayCircle className="mr-2 size-4" />
              Activate
            </DropdownMenuItem>
          )}
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="tenants.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(tenant)
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
