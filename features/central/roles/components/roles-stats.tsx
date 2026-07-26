"use client"

import {KeyRoundIcon, LayersIcon, ShieldIcon, UsersIcon,} from "lucide-react"

import {Skeleton} from "@/components/ui/skeleton"
import {MetricCard} from "@/features/central/shared/components/metric-card"
import {formatCompactNumber} from "@/features/central/shared/lib/format"
import {useGetRoleStatistics} from "@/features/central/roles/hooks/use-role-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function RolesStats() {
    const {data, isLoading, error} = useGetRoleStatistics()

    useQueryErrorToast(error ?? null, "Failed to load role statistics.")

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
                title="Total roles"
                value={formatCompactNumber(data?.total_roles ?? 0)}
                description="Platform roles"
                icon={KeyRoundIcon}
            />
            <MetricCard
                title="Permissions"
                value={formatCompactNumber(data?.total_permissions ?? 0)}
                description="Catalog entries"
                icon={ShieldIcon}
            />
            <MetricCard
                title="Assigned users"
                value={formatCompactNumber(data?.assigned_users ?? 0)}
                description="Across all roles"
                icon={UsersIcon}
            />
            <MetricCard
                title="Groups"
                value={formatCompactNumber(data?.groups ?? 0)}
                description="Permission groups"
                icon={LayersIcon}
            />
        </div>
    )
}
