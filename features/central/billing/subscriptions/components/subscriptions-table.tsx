"use client"

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { columns } from "@/features/central/billing/subscriptions/components/subscriptions-columns"
import { useGetSubscriptions } from "@/features/central/billing/subscriptions/hooks/use-subscription-query"
import { useDataTable } from "@/hooks/use-data-table"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { formatDate, formatToLocalDateString } from "@/lib/format"

const COLUMN_COUNT = 8
const FILTER_COUNT = 4

export function SubscriptionsTable() {
  const [search] = useQueryState("id", parseAsString.withDefault(""))
  const [status] = useQueryState(
      "status",
      parseAsArrayOf(parseAsString).withDefault([])
  )
  const [gateway] = useQueryState(
      "gateway",
      parseAsArrayOf(parseAsString).withDefault([])
  )
  const [createdAt] = useQueryState(
      "created_at",
      parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetSubscriptions({
    search: search || undefined,
    status: status[0] || undefined,
    gateway: gateway[0] || undefined,
    start_date: formatToLocalDateString(createdAt[0]) || undefined,
    end_date: formatToLocalDateString(createdAt[1]) || undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error ?? null, "Failed to load subscriptions.")

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
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { left: ["id"], right: ["actions"] },
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
            cellWidths={[
              "auto",
              "10rem",
              "7rem",
              "7rem",
              "7rem",
              "7rem",
              "3rem",
            ]}
        />
    )
  }

  return (
      <PermissionGate permissions="subscriptions.view">
        <div className="data-table-container space-y-4">
          <DataTable table={table}>
            <DataTableToolbar table={table} />
          </DataTable>
        </div>
      </PermissionGate>
  )
}