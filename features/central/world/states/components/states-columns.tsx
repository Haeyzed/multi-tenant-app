"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableRowActions } from "@/features/central/world/states/components/data-table-row-actions"
import type { CountryOption, State } from "@/types/central/world"

export function buildColumns(
  countryOptions: CountryOption[]
): ColumnDef<State>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      meta: {
        label: "Name",
        placeholder: "Search states...",
        variant: "text",
        icon: Search,
      },
      enableColumnFilter: true,
      cell: ({ cell }) => (
        <span className="truncate font-medium">{cell.getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "state_code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Code" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {(row.getValue("state_code") as string | null) || "—"}
        </span>
      ),
    },
    {
      id: "country_id",
      accessorKey: "country_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Country" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.country?.name ?? row.original.country_id}
        </span>
      ),
      meta: {
        label: "Country",
        variant: "select",
        options: countryOptions,
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground capitalize">
          {(row.getValue("type") as string | null) || "—"}
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
}
