"use client"

import {type Row} from "@tanstack/react-table"
import {CreditCard, Eye, Mail, MoreHorizontal, Slash} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {useInvoices} from "@/features/central/billing/invoices/components/invoices-provider"
import type {Invoice} from "@/types/central/invoice"

type DataTableRowActionsProps<TData> = {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {
    const invoice = row.original as Invoice
    const {setOpen, setCurrentRow} = useInvoices()

    const canVoid = !["paid", "void"].includes(invoice.status)
    const canCharge =
        ["open", "pending", "overdue"].includes(invoice.status) &&
        Number(invoice.balance_due) > 0

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
                <PermissionGate permissions="billing.invoices.view">
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(invoice)
                            setOpen("view")
                        }}
                    >
                        <Eye className="mr-2 size-4"/>
                        View
                    </DropdownMenuItem>
                </PermissionGate>
                {canCharge && (
                    <PermissionGate permissions="billing.payments.charge">
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentRow(invoice)
                                setOpen("charge")
                            }}
                        >
                            <CreditCard className="mr-2 size-4"/>
                            Charge
                        </DropdownMenuItem>
                    </PermissionGate>
                )}
                {canCharge && (
                    <PermissionGate permissions="billing.invoices.manage">
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentRow(invoice)
                                setOpen("send-link")
                            }}
                        >
                            <Mail className="mr-2 size-4"/>
                            Send payment link
                        </DropdownMenuItem>
                    </PermissionGate>
                )}
                {canVoid && (
                    <PermissionGate permissions="billing.invoices.manage">
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                                setCurrentRow(invoice)
                                setOpen("void")
                            }}
                        >
                            <Slash className="mr-2 size-4"/>
                            Void
                        </DropdownMenuItem>
                    </PermissionGate>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
