"use client"

import {Building2Icon, ClockIcon, GlobeIcon, MapIcon,} from "lucide-react"

import {Skeleton} from "@/components/ui/skeleton"
import {MetricCard} from "@/features/central/shared/components/metric-card"
import {formatCompactNumber} from "@/features/central/shared/lib/format"
import {useWorldStatistics} from "@/features/central/world/hooks/use-world-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function StatesStats() {
    const {data, isLoading, error} = useWorldStatistics()

    useQueryErrorToast(error ?? null, "Failed to load world statistics.")

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
                title="States"
                value={formatCompactNumber(data?.states ?? 0)}
                description="All states and provinces"
                icon={MapIcon}
            />
            <MetricCard
                title="Countries"
                value={formatCompactNumber(data?.countries ?? 0)}
                description="Parent countries"
                icon={GlobeIcon}
            />
            <MetricCard
                title="Cities"
                value={formatCompactNumber(data?.cities ?? 0)}
                description="Cities within states"
                icon={Building2Icon}
            />
            <MetricCard
                title="Timezones"
                value={formatCompactNumber(data?.timezones ?? 0)}
                description="Across all countries"
                icon={ClockIcon}
            />
        </div>
    )
}
