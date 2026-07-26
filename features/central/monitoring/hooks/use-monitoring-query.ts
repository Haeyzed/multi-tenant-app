import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import {
    flushFailedJobs,
    getFailedJobs,
    getMonitoringDatabase,
    getMonitoringOverview,
    getMonitoringQueue,
    getMonitoringRedis,
    getMonitoringServer,
    getMonitoringStorage,
    retryFailedJob,
} from "@/lib/services/central/monitoring-service"
import {listQueryOptions} from "@/lib/query/query-options"

export const monitoringQueryKey = ["central", "monitoring"] as const

export const monitoringOverviewQueryKey = [
    ...monitoringQueryKey,
    "overview",
] as const

export const failedJobsQueryKey = (params?: Record<string, unknown>) =>
    [...monitoringQueryKey, "failed-jobs", params ?? {}] as const

export const monitoringSubsystemQueryKey = (subsystem: string) =>
    [...monitoringQueryKey, subsystem] as const

export function useGetMonitoringOverview() {
    return useQuery({
        queryKey: monitoringOverviewQueryKey,
        queryFn: getMonitoringOverview,
        staleTime: 15_000,
    })
}

export function useGetMonitoringQueue() {
    return useQuery({
        queryKey: monitoringSubsystemQueryKey("queue"),
        queryFn: getMonitoringQueue,
        staleTime: 15_000,
    })
}

export function useGetFailedJobs(params?: {
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: failedJobsQueryKey(params),
        queryFn: ({signal}) => getFailedJobs(params, signal),
        ...listQueryOptions,
        staleTime: 15_000,
    })
}

export function useGetMonitoringDatabase() {
    return useQuery({
        queryKey: monitoringSubsystemQueryKey("database"),
        queryFn: getMonitoringDatabase,
    })
}

export function useGetMonitoringStorage() {
    return useQuery({
        queryKey: monitoringSubsystemQueryKey("storage"),
        queryFn: getMonitoringStorage,
    })
}

export function useGetMonitoringRedis() {
    return useQuery({
        queryKey: monitoringSubsystemQueryKey("redis"),
        queryFn: getMonitoringRedis,
    })
}

export function useGetMonitoringServer() {
    return useQuery({
        queryKey: monitoringSubsystemQueryKey("server"),
        queryFn: getMonitoringServer,
    })
}

export function useRetryFailedJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => retryFailedJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: monitoringQueryKey})
        },
    })
}

export function useFlushFailedJobs() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: flushFailedJobs,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: monitoringQueryKey})
        },
    })
}
