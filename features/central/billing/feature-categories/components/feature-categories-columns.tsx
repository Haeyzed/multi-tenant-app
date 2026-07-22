"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {CheckCircle2, EyeOff, Search} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {DataTableRowActions} from "@/features/central/billing/feature-categories/components/data-table-row-actions"
import type {FeatureCategory} from "@/types/central/feature-category"

export const columns: ColumnDef<FeatureCategory>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Name"/>
        ),
        meta: {
            label: "Name",
            placeholder: "Search categories...",
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
        accessorKey: "sort_order",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Sort order"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.original.sort_order ?? 0}
      </span>
        ),
    },
    {
        id: "is_active",
        accessorKey: "is_active",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Active"/>
        ),
        cell: ({row}) =>
            row.original.is_active ? (
                <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="size-3"/>
                    Active
                </Badge>
            ) : (
                <Badge variant="outline" className="gap-1">
                    <EyeOff className="size-3"/>
                    Inactive
                </Badge>
            ),
    },
    {
        accessorKey: "features_count",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Features"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.original.features_count ?? 0}
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
