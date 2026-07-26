"use client"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    ResponsiveDialog,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {formatMoney} from "@/features/central/shared/lib/format"
import type {Payment} from "@/features/central/billing/payments/types"

type PaymentsViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    payment: Payment
}

export function PaymentsViewDialog({
                                       open,
                                       onOpenChange,
                                       payment,
                                   }: PaymentsViewDialogProps) {
    const money = (value: string | number) =>
        formatMoney(Number(value), payment.currency, "en-US")

    const rows = [
        ["Tenant", payment.tenant?.name ?? payment.tenant_id],
        ["Invoice", payment.invoice?.number ?? "—"],
        ["Amount", money(payment.amount)],
        [
            "Refunded",
            payment.refunded_amount ? money(payment.refunded_amount) : "—",
        ],
        ["Gateway", payment.gateway_label ?? payment.gateway ?? "—"],
        ["Gateway reference", payment.gateway_reference ?? "—"],
        ["Failure reason", payment.failure_reason ?? "—"],
        [
            "Paid",
            payment.paid_at ? new Date(payment.paid_at).toLocaleString() : "—",
        ],
        ["Created", new Date(payment.created_at).toLocaleString()],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Payment details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for payment #{payment.id}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="max-h-[65vh] space-y-3 overflow-y-auto pe-1 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="capitalize">
                            {payment.status_label ?? payment.status}
                        </Badge>
                    </div>

                    {rows.map(([label, value]) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                        >
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-end font-medium">{value}</span>
                        </div>
                    ))}

                    {payment.refunds && payment.refunds.length > 0 ? (
                        <div className="space-y-2">
                            <span className="text-muted-foreground">Refunds</span>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="p-2 font-normal">Amount</th>
                                        <th className="p-2 font-normal">Status</th>
                                        <th className="p-2 font-normal">Reason</th>
                                        <th className="p-2 text-end font-normal">Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {payment.refunds.map((refund) => (
                                        <tr key={refund.id} className="border-b last:border-b-0">
                                            <td className="p-2">{money(refund.amount)}</td>
                                            <td className="p-2 capitalize">{refund.status}</td>
                                            <td className="p-2">{refund.reason ?? "—"}</td>
                                            <td className="p-2 text-end">
                                                {refund.refunded_at
                                                    ? new Date(refund.refunded_at).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : null}
                </div>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Close</Button>}
                    />
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
