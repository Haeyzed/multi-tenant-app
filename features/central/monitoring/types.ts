export type MonitoringStatus =
  "healthy" | "degraded" | "warning" | "critical" | "down" | "unknown"

export type MonitoringDatabase = {
  ok: boolean
  driver?: string
  latency_ms?: number
  message?: string
}

export type MonitoringCache = {
  ok: boolean
  driver?: string
  message?: string
}

export type MonitoringQueue = {
  status: MonitoringStatus
  pending_jobs: number
  failed_jobs: number
  connection: string
}

export type MonitoringStorage = {
  ok: boolean
  path: string
  writable: boolean
  free_bytes: number | null
  total_bytes: number | null
}

export type MonitoringRedis = {
  ok: boolean
  configured: boolean
  message: string
}

export type MonitoringServer = {
  php_version: string
  laravel_version: string
  environment: string
  debug: boolean
  timezone: string
  memory_limit: string
  memory_usage_bytes: number
}

export type MonitoringOverview = {
  status: MonitoringStatus
  checked_at: string
  database: MonitoringDatabase
  cache: MonitoringCache
  queue: MonitoringQueue
  storage: MonitoringStorage
  redis: MonitoringRedis
  server: MonitoringServer
  failed_jobs: {
    count: number
  }
}

export type FailedJob = {
  id: number
  uuid: string
  connection: string
  queue: string
  failed_at: string
  exception: string
}

export type MonitoringMeta = {
  total: number
  per_page: number
  current_page: number
  last_page?: number
}

export type PaginatedFailedJobs = {
  data: FailedJob[]
  meta: MonitoringMeta
}
