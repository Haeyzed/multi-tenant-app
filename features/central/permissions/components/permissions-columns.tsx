"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {Search} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableRowActions} from "@/features/central/permissions/components/permissions-row-actions"
import type {PermissionItem} from "@/types/central/rbac"

export const columns: ColumnDef<PermissionItem>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={table.getIsSomePageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
    },
    {
        id: "name",
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Name"/>
        ),
        meta: {
            label: "Name",
            placeholder: "Search permissions...",
            variant: "text",
            icon: Search,
        },
        enableColumnFilter: true,
        cell: ({cell}) => (
            <span className="truncate font-medium font-mono text-sm">
        {cell.getValue<string>()}
      </span>
        ),
    },
    {
        accessorKey: "group",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Group"/>
        ),
        cell: ({row}) => {
            const group = row.original.group ?? row.original.name.split(".")[0]
            return (
                <Badge variant="outline" className="capitalize">
                    {group || "—"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "guard_name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Guard"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.getValue("guard_name") || "—"}
      </span>
        ),
    },
    {
        accessorKey: "created_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Created"/>
        ),
        cell: ({row}) => (
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
        cell: ({row}) => <DataTableRowActions row={row}/>,
        size: 32,
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
    },
]
