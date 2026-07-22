"use client"

import {CheckCircle2Icon, ClockIcon, FileTextIcon, XCircleIcon,} from "lucide-react"

import {Skeleton} from "@/components/ui/skeleton"
import {useGetInvoiceStatistics} from "@/features/central/billing/invoices/hooks/use-invoice-query"
import {MetricCard} from "@/features/central/dashboard/components/metric-card"
import {formatCompactNumber, formatMoney,} from "@/features/central/dashboard/lib/format"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function InvoicesStats() {
    const {data, isLoading, error} = useGetInvoiceStatistics()

    useQueryErrorToast(error ?? null, "Failed to load invoice statistics.")

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({length: 4}).map((_, index) => (
                    <Skeleton key={index} className="h-32 rounded-xl"/>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
                title="Total invoices"
                value={formatCompactNumber(data?.total ?? 0)}
                description="All invoices"
                icon={FileTextIcon}
            />
            <MetricCard
                title="Paid"
                value={formatCompactNumber(data?.paid ?? 0)}
                description="Settled invoices"
                icon={CheckCircle2Icon}
            />
            <MetricCard
                title="Open"
                value={formatCompactNumber(data?.open ?? 0)}
                description="Awaiting payment"
                icon={ClockIcon}
            />
            <MetricCard
                title="Total volume"
                value={formatMoney(data?.volume ?? 0)}
                description="Billed to date"
                icon={XCircleIcon}
            />
        </div>
    )
}
