"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {ArrowLeftToLine, ArrowRightToLine, Search,} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {DataTableRowActions} from "@/features/central/world/languages/components/data-table-row-actions"
import type {Language} from "@/types/central/world"

export const columns: ColumnDef<Language>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Name"/>
        ),
        meta: {
            label: "Name",
            placeholder: "Search languages...",
            variant: "text",
            icon: Search,
        },
        enableColumnFilter: true,
        cell: ({cell}) => (
            <span className="truncate font-medium">{cell.getValue<string>()}</span>
        ),
    },
    {
        accessorKey: "code",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Code"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground uppercase">
        {row.getValue("code")}
      </span>
        ),
    },
    {
        accessorKey: "name_native",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Native name"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {(row.getValue("name_native") as string | null) || "—"}
      </span>
        ),
    },
    {
        id: "dir",
        accessorKey: "dir",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Direction"/>
        ),
        cell: ({row}) => {
            const dir = row.getValue("dir") as string | null
            if (!dir) {
                return <span className="text-muted-foreground">—</span>
            }
            return <Badge variant="outline" className="uppercase">{dir}</Badge>
        },
        meta: {
            label: "Direction",
            variant: "select",
            options: [
                {label: "LTR", value: "ltr", icon: ArrowRightToLine},
                {label: "RTL", value: "rtl", icon: ArrowLeftToLine},
            ],
        },
        enableColumnFilter: true,
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
