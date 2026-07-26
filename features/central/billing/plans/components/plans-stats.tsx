"use client"

import {ArchiveIcon, CheckCircle2Icon, FileStackIcon, SparklesIcon,} from "lucide-react"

import {Skeleton} from "@/components/ui/skeleton"
import {MetricCard} from "@/features/central/shared/components/metric-card"
import {formatCompactNumber} from "@/features/central/shared/lib/format"
import {useGetPlanStatistics} from "@/features/central/billing/plans/hooks/use-plan-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function PlansStats() {
    const {data, isLoading, error} = useGetPlanStatistics()

    useQueryErrorToast(error ?? null, "Failed to load plan statistics.")

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
                title="Total plans"
                value={formatCompactNumber(data?.total ?? 0)}
                description="All plans"
                icon={FileStackIcon}
            />
            <MetricCard
                title="Active"
                value={formatCompactNumber(data?.active ?? 0)}
                description="Available for billing"
                icon={CheckCircle2Icon}
            />
            <MetricCard
                title="Public"
                value={formatCompactNumber(data?.public ?? 0)}
                description="Shown on signup"
                icon={SparklesIcon}
            />
            <MetricCard
                title="Archived"
                value={formatCompactNumber(data?.archived ?? 0)}
                description="Retired plans"
                icon={ArchiveIcon}
            />
        </div>
    )
}
