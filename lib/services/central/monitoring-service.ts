import { type ApiEnvelope, centralApiClient } from "@/lib/api/central-client"
import type {
  MonitoringDatabase,
  MonitoringOverview,
  MonitoringQueue,
  MonitoringRedis,
  MonitoringServer,
  MonitoringStorage,
  PaginatedFailedJobs,
} from "@/features/central/monitoring/types"

export async function getMonitoringOverview(): Promise<MonitoringOverview> {
  const response =
    await centralApiClient.get<ApiEnvelope<MonitoringOverview>>("/monitoring")

  return response.data
}

export async function getMonitoringQueue(): Promise<MonitoringQueue> {
  const response =
    await centralApiClient.get<ApiEnvelope<MonitoringQueue>>(
      "/monitoring/queue"
    )

  return response.data
}

export async function getFailedJobs(
  params?: {
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<PaginatedFailedJobs> {
  const response = await centralApiClient.get<
    ApiEnvelope<PaginatedFailedJobs["data"]> & {
      meta?: PaginatedFailedJobs["meta"]
    }
  >("/monitoring/failed-jobs", params, { signal })

  return {
    data: response.data,
    meta: response.meta || {
      total: response.data.length,
      per_page: params?.per_page ?? 25,
      current_page: params?.page ?? 1,
      last_page: 1,
    },
  }
}

export async function retryFailedJob(id: number) {
  const response = await centralApiClient.post<ApiEnvelope<null>>(
    `/monitoring/failed-jobs/${id}/retry`,
    {}
  )

  return { data: null, message: response.message }
}

export async function flushFailedJobs() {
  const response = await centralApiClient.delete<
    ApiEnvelope<{ deleted: number }>
  >("/monitoring/failed-jobs")

  return { data: response.data, message: response.message }
}

export async function getMonitoringDatabase(): Promise<MonitoringDatabase> {
  const response = await centralApiClient.get<ApiEnvelope<MonitoringDatabase>>(
    "/monitoring/database"
  )

  return response.data
}

export async function getMonitoringStorage(): Promise<MonitoringStorage> {
  const response = await centralApiClient.get<ApiEnvelope<MonitoringStorage>>(
    "/monitoring/storage"
  )

  return response.data
}

export async function getMonitoringRedis(): Promise<MonitoringRedis> {
  const response =
    await centralApiClient.get<ApiEnvelope<MonitoringRedis>>(
      "/monitoring/redis"
    )

  return response.data
}

export async function getMonitoringServer(): Promise<MonitoringServer> {
  const response =
    await centralApiClient.get<ApiEnvelope<MonitoringServer>>(
      "/monitoring/server"
    )

  return response.data
}
