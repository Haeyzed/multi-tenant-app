"use client"

import { type Row } from "@tanstack/react-table"
import {
  Edit,
  Eye,
  MoreHorizontal,
  Shield,
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
import { useRoles } from "@/features/central/roles/components/roles-provider"
import type { CentralRole } from "@/types/central/rbac"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

const SUPER_ADMIN_ROLE = "super-admin"

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const role = row.original as CentralRole
  const { setOpen, setCurrentRow } = useRoles()
  const isSuperAdmin = role.name === SUPER_ADMIN_ROLE

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
      <DropdownMenuContent align="end" className="w-52">
        <PermissionGate permissions="roles.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(role)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 size-4" />
            View
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="roles.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(role)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="roles.assign-permissions">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(role)
              setOpen("assignPermissions")
            }}
          >
            <Shield className="mr-2 size-4" />
            Manage permissions
          </DropdownMenuItem>
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="roles.delete">
          <DropdownMenuItem
            variant="destructive"
            disabled={isSuperAdmin}
            onClick={() => {
              if (isSuperAdmin) {
                return
              }
              setCurrentRow(role)
              setOpen("delete")
            }}
          >
            <Trash2 className="mr-2 size-4" />
            {isSuperAdmin ? "Delete (protected)" : "Delete"}
          </DropdownMenuItem>
        </PermissionGate>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
