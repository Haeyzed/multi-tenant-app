"use client"

import { LockIcon } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { permissions } from "@/features/central/auth/components/permissions"
import { PermissionsBulkActions } from "@/features/central/permissions/components/permissions-bulk-actions"
import { columns } from "@/features/central/permissions/components/permissions-columns"
import { useGetPaginatedPermissions } from "@/features/central/permissions/hooks/use-permission-query"
import { useDataTable } from "@/hooks/use-data-table"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

const COLUMN_COUNT = 6
const FILTER_COUNT = 1

export function PermissionsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetPaginatedPermissions({
    search: name || undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error ?? null, "Failed to load permissions.")

  const tableData = data?.data || []

  const { table } = useDataTable({
    data: tableData,
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
      pagination: { pageIndex: 0, pageSize: perPage },
    },
    getRowId: (row) => String(row.id),
  })

  if (isLoading) {
    return (
        <DataTableSkeleton
            columnCount={COLUMN_COUNT}
            rowCount={perPage}
            filterCount={FILTER_COUNT}
            cellWidths={["auto", "12rem", "8rem", "6rem", "8rem", "3rem"]}
        />
    )
  }

  return (
      <PermissionGate
          permissions={[permissions.users.permissions.view]}
          fallback={
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
              <LockIcon className="text-muted-foreground mb-2 size-8" />
              <h3 className="font-semibold">Access Restricted</h3>
              <p className="text-muted-foreground text-sm">
                You do not have permission to view the permissions catalog table.
              </p>
            </div>
          }
      >
        <div className="data-table-container space-y-4">
          <DataTable
              table={table}
              actionBar={<PermissionsBulkActions table={table} />}
          >
            <DataTableToolbar table={table} />
          </DataTable>
        </div>
      </PermissionGate>
  )
}