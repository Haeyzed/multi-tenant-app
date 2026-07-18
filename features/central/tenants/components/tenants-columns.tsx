"use client"

import { type ColumnDef } from "@tanstack/react-table"
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  FlaskConical,
  Search,
  XCircle,
} from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "@/features/central/tenants/components/data-table-row-actions"
import type { Tenant, TenantStatus } from "@/types/central/tenant"

const statusVariantMap: Record<
  TenantStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  active: "secondary",
  pending: "outline",
  suspended: "destructive",
  trial: "secondary",
  expired: "outline",
  grace_period: "outline",
  archived: "outline",
}

export const columns: ColumnDef<Tenant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    meta: {
      label: "Name",
      placeholder: "Search tenants...",
      variant: "text",
      icon: Search,
    },
    enableColumnFilter: true,
    cell: ({ cell }) => (
      <span className="truncate font-medium">{cell.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Slug" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("slug")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Email" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {(row.getValue("email") as string | null) || "—"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Phone" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {(row.getValue("phone") as string | null) || "—"}
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
      const status = row.getValue("status") as TenantStatus
      return (
        <Badge variant={statusVariantMap[status] ?? "outline"} className="capitalize">
          {row.original.status_label ?? status.replaceAll("_", " ")}
        </Badge>
      )
    },
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Active", value: "active", icon: CheckCircle2 },
        { label: "Pending", value: "pending", icon: Clock },
        { label: "Trial", value: "trial", icon: FlaskConical },
        { label: "Suspended", value: "suspended", icon: AlertTriangle },
        { label: "Expired", value: "expired", icon: XCircle },
        { label: "Grace period", value: "grace_period", icon: AlertTriangle },
        { label: "Archived", value: "archived", icon: Archive },
      ],
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "domains_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Domains" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.domains_count ?? row.original.domains?.length ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "trial_ends_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Trial Ends" />
    ),
    cell: ({ row }) => {
      const trialEnds = row.getValue("trial_ends_at")
      return (
        <span className="text-muted-foreground">
          {trialEnds
            ? new Date(trialEnds as string).toLocaleDateString()
            : "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.created_at_human ??
          new Date(row.getValue("created_at")).toLocaleDateString()}
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
