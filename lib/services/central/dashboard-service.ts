import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  DashboardActivity,
  DashboardCharts,
  DashboardOverview,
} from "@/types/central/dashboard"

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await centralApiClient.get<ApiEnvelope<DashboardOverview>>(
    "/dashboard"
  )
  return response.data
}

export async function getDashboardCharts(
  days = 30
): Promise<DashboardCharts> {
  const response = await centralApiClient.get<ApiEnvelope<DashboardCharts>>(
    "/dashboard/charts",
    { days }
  )
  return response.data
}

export async function getDashboardActivities(
  limit = 15
): Promise<DashboardActivity[]> {
  const response = await centralApiClient.get<
    ApiEnvelope<DashboardActivity[]>
  >("/dashboard/activities", { limit })
  return response.data
}
