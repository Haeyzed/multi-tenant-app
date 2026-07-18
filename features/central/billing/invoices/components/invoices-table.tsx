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
import { columns } from "@/features/central/billing/invoices/components/invoices-columns"
import { useGetInvoices } from "@/features/central/billing/invoices/hooks/use-invoice-query"
import { useDataTable } from "@/hooks/use-data-table"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

const COLUMN_COUNT = 8
const FILTER_COUNT = 2

export function InvoicesTable() {
  const [search] = useQueryState("number", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetInvoices({
    search: search || undefined,
    status: status[0] || undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error ?? null, "Failed to load invoices.")

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
      columnPinning: { left: ["number"], right: ["actions"] },
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
          "7rem",
          "3rem",
        ]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
