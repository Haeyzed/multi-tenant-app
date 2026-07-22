"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {Archive, CheckCircle2, Clock, EyeOff, Search, Star,} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableRowActions} from "@/features/central/plans/components/data-table-row-actions"
import type {Plan, PlanStatus} from "@/types/central/plan"

const statusVariantMap: Record<
    PlanStatus,
    React.ComponentProps<typeof Badge>["variant"]
> = {
    active: "secondary",
    draft: "outline",
    inactive: "outline",
    archived: "destructive",
}

export const columns: ColumnDef<Plan>[] = [
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
            placeholder: "Search plans...",
            variant: "text",
            icon: Search,
        },
        enableColumnFilter: true,
        cell: ({row}) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{row.original.name}</span>
                <span className="text-muted-foreground truncate text-xs">
          {row.original.slug}
        </span>
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Price"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.original.currency} {Number(row.original.price).toFixed(2)}
      </span>
        ),
    },
    {
        accessorKey: "billing_interval",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Interval"/>
        ),
        cell: ({row}) => (
            <span className="capitalize">
        {row.original.billing_interval_label ??
            row.original.billing_interval ??
            "—"}
      </span>
        ),
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Status"/>
        ),
        cell: ({row}) => {
            const status = row.getValue("status") as PlanStatus
            return (
                <Badge
                    variant={statusVariantMap[status] ?? "outline"}
                    className="capitalize"
                >
                    {row.original.status_label ?? status}
                </Badge>
            )
        },
        meta: {
            label: "Status",
            variant: "select",
            options: [
                {label: "Active", value: "active", icon: CheckCircle2},
                {label: "Draft", value: "draft", icon: Clock},
                {label: "Inactive", value: "inactive", icon: EyeOff},
                {label: "Archived", value: "archived", icon: Archive},
            ],
        },
        enableColumnFilter: true,
    },
    {
        accessorKey: "visibility",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Visibility"/>
        ),
        cell: ({row}) => (
            <span className="capitalize">
        {row.original.visibility_label ?? row.original.visibility}
      </span>
        ),
    },
    {
        accessorKey: "is_featured",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Featured"/>
        ),
        cell: ({row}) =>
            row.original.is_featured ? (
                <Star className="size-4 fill-current text-amber-500"/>
            ) : (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        accessorKey: "trial_days",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Trial"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.original.trial_days || 0}d
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
        {row.original.created_at_human ??
            new Date(row.getValue("created_at")).toLocaleDateString()}
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
