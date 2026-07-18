"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "@/features/central/roles/components/data-table-row-actions"
import type { CentralRole } from "@/types/central/rbac"

const SUPER_ADMIN_ROLE = "super-admin"

export const columns: ColumnDef<CentralRole>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      const isSuperAdmin = row.original.name === SUPER_ADMIN_ROLE
      return (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={isSuperAdmin}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      )
    },
    size: 32,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    meta: {
      label: "Name",
      placeholder: "Search roles...",
      variant: "text",
      icon: Search,
    },
    enableColumnFilter: true,
    cell: ({ cell }) => (
      <span className="truncate font-medium capitalize">
        {cell.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "guard_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Guard" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("guard_name") || "—"}
      </span>
    ),
  },
  {
    id: "permissions",
    accessorFn: (row) => row.permissions?.length ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Permissions" />
    ),
    cell: ({ row }) => {
      const permissions = row.original.permissions ?? []
      if (permissions.length === 0) {
        return <span className="text-muted-foreground">—</span>
      }

      return (
        <div className="flex flex-wrap gap-1">
          {permissions.slice(0, 2).map((permission) => (
            <Badge key={permission} variant="outline">
              {permission}
            </Badge>
          ))}
          {permissions.length > 2 ? (
            <Badge variant="outline">+{permissions.length - 2}</Badge>
          ) : null}
        </div>
      )
    },
  },
  {
    accessorKey: "users_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Users" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.users_count ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString()
          : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 32,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
]
