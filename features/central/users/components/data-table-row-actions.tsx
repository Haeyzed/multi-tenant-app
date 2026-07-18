"use client"

import { type Row } from "@tanstack/react-table"
import {
  Activity,
  Edit,
  Eye,
  KeyRound,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Shield,
  ShieldCheck,
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
import { useUsers } from "@/features/central/users/components/users-provider"
import type { CentralUser } from "@/types/central/user"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = row.original as CentralUser
  const { setOpen, setCurrentRow } = useUsers()

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
        <PermissionGate permissions="users.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(user)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 size-4" />
            View
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="users.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(user)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="users.assign-roles">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(user)
              setOpen("assignRoles")
            }}
          >
            <KeyRound className="mr-2 size-4" />
            Assign roles
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="users.assign-permissions">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(user)
              setOpen("assignPermissions")
            }}
          >
            <Shield className="mr-2 size-4" />
            Assign permissions
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="users.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(user)
              setOpen("security")
            }}
          >
            <ShieldCheck className="mr-2 size-4" />
            Security
          </DropdownMenuItem>
        </PermissionGate>
        <PermissionGate permissions="users.view-activity">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(user)
              setOpen("activities")
            }}
          >
            <Activity className="mr-2 size-4" />
            Activities
          </DropdownMenuItem>
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="users.manage-status">
          {user.status === "active" ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(user)
                setOpen("suspend")
              }}
            >
              <PauseCircle className="mr-2 size-4" />
              Suspend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(user)
                setOpen("activate")
              }}
            >
              <PlayCircle className="mr-2 size-4" />
              Activate
            </DropdownMenuItem>
          )}
        </PermissionGate>
        <DropdownMenuSeparator />
        <PermissionGate permissions="users.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(user)
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
