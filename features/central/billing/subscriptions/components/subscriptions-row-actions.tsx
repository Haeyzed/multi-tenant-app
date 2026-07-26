"use client"

import {type Row} from "@tanstack/react-table"
import {
    AlertTriangle,
    ArrowDownCircle,
    ArrowUpCircle,
    Ban,
    Eye,
    LockIcon,
    MoreHorizontal,
    PauseCircle,
    PlayCircle,
    RefreshCw,
    XCircle,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/permissions"
import {useSubscriptions} from "@/features/central/billing/subscriptions/components/subscriptions-provider"
import type {Subscription} from "@/features/central/billing/subscriptions/types"

type DataTableRowActionsProps<TData> = {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    const subscription = row.original as Subscription
    const {setOpen, setCurrentRow} = useSubscriptions()

    const openWith = (dialog: Parameters<typeof setOpen>[0]) => {
        setCurrentRow(subscription)
        setOpen(dialog)
    }

    const isActiveLike = ["active", "trialing", "past_due"].includes(
        subscription.status
    )
    const isPaused = subscription.status === "paused"
    const isTerminal = ["cancelled", "expired"].includes(subscription.status)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" className="flex size-8 p-0">
                        <MoreHorizontal className="size-4"/>
                        <span className="sr-only">Open menu</span>
                    </Button>
                }
            />
            <DropdownMenuContent align="end" className="w-52">
                <PermissionGate
                    permissions={[permissions.subscriptions.view]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            View
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuItem onClick={() => openWith("view")}>
                        <Eye className="mr-2 size-4"/>
                        View
                    </DropdownMenuItem>
                </PermissionGate>

                <PermissionGate
                    permissions={[permissions.subscriptions.update]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Manage
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuSeparator/>
                    {!isTerminal && (
                        <DropdownMenuItem onClick={() => openWith("renew")}>
                            <RefreshCw className="mr-2 size-4"/>
                            Renew
                        </DropdownMenuItem>
                    )}
                    {isActiveLike && (
                        <DropdownMenuItem onClick={() => openWith("pause")}>
                            <PauseCircle className="mr-2 size-4"/>
                            Pause
                        </DropdownMenuItem>
                    )}
                    {isPaused && (
                        <DropdownMenuItem onClick={() => openWith("resume")}>
                            <PlayCircle className="mr-2 size-4"/>
                            Resume
                        </DropdownMenuItem>
                    )}
                    {!isTerminal && (
                        <DropdownMenuItem onClick={() => openWith("upgrade")}>
                            <ArrowUpCircle className="mr-2 size-4"/>
                            Upgrade
                        </DropdownMenuItem>
                    )}
                    {!isTerminal && (
                        <DropdownMenuItem onClick={() => openWith("downgrade")}>
                            <ArrowDownCircle className="mr-2 size-4"/>
                            Downgrade
                        </DropdownMenuItem>
                    )}
                    {!isTerminal && (
                        <DropdownMenuItem onClick={() => openWith("past-due")}>
                            <AlertTriangle className="mr-2 size-4"/>
                            Mark past due
                        </DropdownMenuItem>
                    )}
                </PermissionGate>

                <PermissionGate
                    permissions={[permissions.subscriptions.manage]}
                    fallback={
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                            <LockIcon className="mr-2 size-4"/>
                            Cancel
                        </DropdownMenuItem>
                    }
                >
                    <DropdownMenuSeparator/>
                    {!isTerminal && (
                        <DropdownMenuItem onClick={() => openWith("expire")}>
                            <XCircle className="mr-2 size-4"/>
                            Expire
                        </DropdownMenuItem>
                    )}
                    {!isTerminal && (
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openWith("cancel")}
                        >
                            <Ban className="mr-2 size-4"/>
                            Cancel
                        </DropdownMenuItem>
                    )}
                </PermissionGate>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
