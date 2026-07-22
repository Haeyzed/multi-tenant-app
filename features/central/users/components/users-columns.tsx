"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {AlertTriangle, CheckCircle2, CircleOff, Search,} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableRowActions} from "@/features/central/users/components/data-table-row-actions"
import type {CentralUser, UserStatus} from "@/types/central/user"

const statusVariantMap: Record<
    UserStatus,
    React.ComponentProps<typeof Badge>["variant"]
> = {
    active: "secondary",
    inactive: "outline",
    suspended: "destructive",
}

function getInitials(name?: string | null): string {
    if (!name) {
        return "?"
    }

    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
        return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
    }

    return (parts[0]?.[0] ?? "?").toUpperCase()
}

export const columns: ColumnDef<CentralUser>[] = [
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
            placeholder: "Search users...",
            variant: "text",
            icon: Search,
        },
        enableColumnFilter: true,
        cell: ({row}) => {
            const user = row.original
            return (
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-8">
                        {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.name}/>
                        ) : null}
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium">{user.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Email"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">{row.getValue("email")}</span>
        ),
    },
    {
        accessorKey: "phone",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Phone"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {(row.getValue("phone") as string | null) || "—"}
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
            const status = (row.getValue("status") as UserStatus) || "inactive"
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
                {label: "Inactive", value: "inactive", icon: CircleOff},
                {label: "Suspended", value: "suspended", icon: AlertTriangle},
            ],
        },
        enableColumnFilter: true,
    },
    {
        id: "roles",
        accessorFn: (row) => row.roles?.join(", ") ?? "",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Roles"/>
        ),
        cell: ({row}) => {
            const roles = row.original.roles ?? []
            if (roles.length === 0) {
                return <span className="text-muted-foreground">—</span>
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {roles.slice(0, 3).map((role) => (
                        <Badge key={role} variant="outline" className="capitalize">
                            {role}
                        </Badge>
                    ))}
                    {roles.length > 3 ? (
                        <Badge variant="outline">+{roles.length - 3}</Badge>
                    ) : null}
                </div>
            )
        },
    },
    {
        accessorKey: "last_login_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Last login"/>
        ),
        cell: ({row}) => {
            const lastLogin = row.original.last_login_at
            return (
                <span className="text-muted-foreground">
          {lastLogin ? new Date(lastLogin).toLocaleString() : "—"}
        </span>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Created"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.original.created_at_human ??
            (row.original.created_at
                ? new Date(row.original.created_at).toLocaleDateString()
                : "—")}
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
