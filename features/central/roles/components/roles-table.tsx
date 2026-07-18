"use client"

import { parseAsInteger, parseAsString, useQueryState } from "nuqs"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { RolesBulkActions } from "@/features/central/roles/components/roles-bulk-actions"
import { columns } from "@/features/central/roles/components/roles-columns"
import { useGetRoles } from "@/features/central/roles/hooks/use-role-query"
import { useDataTable } from "@/hooks/use-data-table"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

const COLUMN_COUNT = 7
const FILTER_COUNT = 1

export function RolesTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetRoles()
  const filteredData = (data?.data ?? []).filter((role) =>
    name ? role.name.toLowerCase().includes(name.toLowerCase()) : true
  )

  useQueryErrorToast(error ?? null, "Failed to load roles.")

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: data?.meta?.last_page || 1,
    queryKeys: {
      page: "page",
      perPage: "per_page",
      sort: "sort",
      filters: "filters",
      joinOperator: "joinOperator",
    },
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { left: ["select", "name"], right: ["actions"] },
      pagination: { pageIndex: page - 1, pageSize: perPage },
    },
    getRowId: (row) => String(row.id),
  })

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={COLUMN_COUNT}
        rowCount={perPage}
        filterCount={FILTER_COUNT}
        cellWidths={["auto", "10rem", "6rem", "12rem", "6rem", "8rem", "3rem"]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable table={table} actionBar={<RolesBulkActions table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
