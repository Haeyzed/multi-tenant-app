import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  DashboardActivity,
  DashboardCharts,
  DashboardOverview,
} from "@/features/central/dashboard/types"

export async function getDashboardOverview(
  signal?: AbortSignal
): Promise<DashboardOverview> {
  const response = await centralApiClient.get<ApiEnvelope<DashboardOverview>>(
    "/dashboard",
    undefined,
    { signal }
  )
  return response.data
}

export async function getDashboardCharts(
  days = 30,
  signal?: AbortSignal
): Promise<DashboardCharts> {
  const response = await centralApiClient.get<ApiEnvelope<DashboardCharts>>(
    "/dashboard/charts",
    { days },
    { signal }
  )
  return response.data
}

export async function getDashboardActivities(
  limit = 15,
  signal?: AbortSignal
): Promise<DashboardActivity[]> {
  const response = await centralApiClient.get<
    ApiEnvelope<DashboardActivity[]>
  >("/dashboard/activities", { limit }, { signal })
  return response.data
}
