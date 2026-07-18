import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  GroupedSettings,
  PublicSettings,
  Setting,
  SettingGroupOption,
} from "@/types/central/setting"

export async function getSettings(params?: {
  group?: string
  search?: string
  public?: boolean
}): Promise<Setting[]> {
  const response = await centralApiClient.get<ApiEnvelope<Setting[]>>(
    "/settings",
    params
  )
  return response.data
}

export async function getPublicSettings(
  group?: string
): Promise<PublicSettings> {
  const response = await centralApiClient.get<ApiEnvelope<PublicSettings>>(
    "/public/settings",
    group ? { group } : undefined
  )
  return response.data
}

export async function getSettingGroups(): Promise<SettingGroupOption[]> {
  const response = await centralApiClient.get<
    ApiEnvelope<SettingGroupOption[]>
  >("/settings/groups")
  return response.data
}

export async function getGroupedSettings(params?: {
  group?: string
  search?: string
  public?: boolean
}): Promise<GroupedSettings> {
  const response = await centralApiClient.get<ApiEnvelope<GroupedSettings>>(
    "/settings/grouped",
    params
  )
  return response.data
}

export async function updateSetting(
  id: number,
  payload: { value: unknown }
) {
  const response = await centralApiClient.put<ApiEnvelope<Setting>>(
    `/settings/${id}`,
    payload
  )
  return { data: response.data, message: response.message }
}

export async function bulkUpdateSettings(values: Record<string, unknown>) {
  const response = await centralApiClient.put<ApiEnvelope<Setting[]>>(
    "/settings/bulk",
    { settings: values }
  )
  return { data: response.data, message: response.message }
}

export async function sendTestMail(email: string) {
  const response = await centralApiClient.post<
    ApiEnvelope<{ email: string; mailer: string | null }>
  >("/settings/mail/test", { email })
  return { data: response.data, message: response.message }
}
