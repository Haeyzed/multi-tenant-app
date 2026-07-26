"use client"

import {CheckCircle2Icon, PauseCircleIcon, ShieldCheckIcon, UsersIcon,} from "lucide-react"

import {Skeleton} from "@/components/ui/skeleton"
import {MetricCard} from "@/features/central/shared/components/metric-card"
import {formatCompactNumber} from "@/features/central/shared/lib/format"
import {useGetUserStatistics} from "@/features/central/users/hooks/use-user-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function UsersStats() {
    const {data, isLoading, error} = useGetUserStatistics()

    useQueryErrorToast(error ?? null, "Failed to load user statistics.")

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
                title="Total users"
                value={formatCompactNumber(data?.total ?? 0)}
                description="All central accounts"
                icon={UsersIcon}
            />
            <MetricCard
                title="Active"
                value={formatCompactNumber(data?.active ?? 0)}
                description="Can sign in"
                icon={CheckCircle2Icon}
            />
            <MetricCard
                title="Suspended"
                value={formatCompactNumber(data?.suspended ?? 0)}
                description="Access revoked"
                icon={PauseCircleIcon}
            />
            <MetricCard
                title="2FA enabled"
                value={formatCompactNumber(data?.with_two_factor ?? 0)}
                description="Extra security"
                icon={ShieldCheckIcon}
            />
        </div>
    )
}
