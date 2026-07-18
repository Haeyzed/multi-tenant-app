"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, Search, XCircle } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "@/features/central/world/countries/components/data-table-row-actions"
import type { Country } from "@/types/central/world"

export const columns: ColumnDef<Country>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    meta: {
      label: "Name",
      placeholder: "Search countries...",
      variant: "text",
      icon: Search,
    },
    enableColumnFilter: true,
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.original.emoji ? `${row.original.emoji} ` : ""}
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "iso2",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="ISO2" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("iso2")}</span>
    ),
  },
  {
    accessorKey: "iso3",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="ISO3" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {(row.getValue("iso3") as string | null) || "—"}
      </span>
    ),
  },
  {
    id: "region",
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Region" />
    ),
    meta: {
      label: "Region",
      placeholder: "Region",
      variant: "text",
    },
    enableColumnFilter: true,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {(row.getValue("region") as string | null) || "—"}
      </span>
    ),
  },
  {
    accessorKey: "phone_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Phone code" />
    ),
    cell: ({ row }) => {
      const phoneCode = row.getValue("phone_code") as string | null
      return (
        <span className="text-muted-foreground">
          {phoneCode ? `+${phoneCode.replace(/^\+/, "")}` : "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "currency_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Currency" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.currency_code || "—"}
      </span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => {
      const isActive = Number(row.original.status ?? 1) === 1
      return (
        <Badge variant={isActive ? "secondary" : "outline"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Active", value: "1", icon: CheckCircle2 },
        { label: "Inactive", value: "0", icon: XCircle },
      ],
    },
    enableColumnFilter: true,
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
