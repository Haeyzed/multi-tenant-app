"use client"

import {BanknoteIcon, ClockIcon, GlobeIcon, LanguagesIcon,} from "lucide-react"

import {Skeleton} from "@/components/ui/skeleton"
import {MetricCard} from "@/features/central/dashboard/components/metric-card"
import {formatCompactNumber} from "@/features/central/dashboard/lib/format"
import {useWorldStatistics} from "@/features/central/world/hooks/use-world-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function LanguagesStats() {
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
                title="Languages"
                value={formatCompactNumber(data?.languages ?? 0)}
                description="All locale languages"
                icon={LanguagesIcon}
            />
            <MetricCard
                title="Countries"
                value={formatCompactNumber(data?.countries ?? 0)}
                description="All countries"
                icon={GlobeIcon}
            />
            <MetricCard
                title="Currencies"
                value={formatCompactNumber(data?.currencies ?? 0)}
                description="All currencies"
                icon={BanknoteIcon}
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
