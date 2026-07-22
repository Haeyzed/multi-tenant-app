"use client"

import {type Row} from "@tanstack/react-table"
import {Eye, MoreHorizontal, RotateCcw} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {usePayments} from "@/features/central/billing/payments/components/payments-provider"
import type {Payment} from "@/types/central/payment"

type DataTableRowActionsProps<TData> = {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    const payment = row.original as Payment
    const {setOpen, setCurrentRow} = usePayments()

    const canRefund = ["completed", "partially_refunded"].includes(
        payment.status
    )

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
            <DropdownMenuContent align="end" className="w-48">
                <PermissionGate permissions="billing.payments.view">
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(payment)
                            setOpen("view")
                        }}
                    >
                        <Eye className="mr-2 size-4"/>
                        View
                    </DropdownMenuItem>
                </PermissionGate>
                {canRefund && (
                    <PermissionGate permissions="billing.payments.refund">
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentRow(payment)
                                setOpen("refund")
                            }}
                        >
                            <RotateCcw className="mr-2 size-4"/>
                            Refund
                        </DropdownMenuItem>
                    </PermissionGate>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
