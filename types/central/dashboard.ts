export type DashboardStatistics = {
  tenants: {
    total: number
    active: number
    trial: number
    suspended: number
    by_status: Record<string, number | string>
  }
  subscriptions: {
    total: number
    active: number
    trialing: number
    past_due: number
    by_status: Record<string, number | string>
  }
  payments: {
    total: number
    completed: number
    failed: number
    volume: number
  }
  users: {
    total: number
  }
}

export type DashboardRevenue = {
  mrr: number
  arr: number
  currency: string
  recurring_subscriptions: number
}

export type GrowthMetric = {
  current: number
  previous: number
  change_percent: number
}

export type DashboardGrowth = {
  period_days: number
  tenants: GrowthMetric
  subscriptions: GrowthMetric
  revenue: GrowthMetric
}

export type HealthCheck = {
  ok: boolean
  message: string
}

export type PlatformHealth = {
  status: string
  checked_at: string
  checks: {
    database: HealthCheck
    cache: HealthCheck
    storage: HealthCheck
  }
}

export type DashboardOverview = {
  statistics: DashboardStatistics
  revenue: DashboardRevenue
  growth: DashboardGrowth
  platform_health: PlatformHealth
}

export type DashboardCharts = {
  revenue: Array<{ date: string; amount: number }>
  tenants: Array<{ date: string; count: number }>
  subscriptions: Array<{ date: string; count: number }>
}

export type DashboardActivity = {
  id: number | string
  log_name: string | null
  description: string
  event: string | null
  subject_type: string | null
  subject_id: number | string | null
  causer_type: string | null
  causer_id: number | string | null
  created_at: string | null
}
