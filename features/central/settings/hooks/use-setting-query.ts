import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import {
    bulkUpdateSettings,
    getGroupedSettings,
    getPublicSettings,
    getSettingGroups,
    getSettings,
    sendTestMail,
    updateSetting,
} from "@/lib/services/central/setting-service"
import {catalogQueryOptions} from "@/lib/query/query-options"
import type {InvoiceSettings} from "@/features/central/settings/types"

export type RecurringBillingInterval = "monthly" | "quarterly" | "yearly"

export const settingsQueryKey = (params?: Record<string, unknown>) =>
    ["central", "settings", params ?? {}] as const

export function useSettings(params?: {
    group?: string
    search?: string
    public?: boolean
}) {
    return useQuery({
        queryKey: settingsQueryKey(params),
        queryFn: ({signal}) => getSettings(params, signal),
        staleTime: 60_000,
    })
}

export function useBillingDefaultInterval(): RecurringBillingInterval {
    const {data: settings = []} = useSettings({group: "billing"})
    const value = settings.find(
        (setting) => setting.key === "billing.default_interval"
    )?.value

    return value === "quarterly" || value === "yearly" ? value : "monthly"
}

export function usePublicSettings(group?: string) {
    return useQuery({
        queryKey: ["central", "settings", "public", group ?? "all"],
        queryFn: ({signal}) => getPublicSettings(group, signal),
        ...catalogQueryOptions,
    })
}

export function useInvoiceSettings() {
    const query = usePublicSettings("invoice")
    const raw = query.data ?? {}
    const pick = (key: string): string | null => {
        const value = raw[`invoice.${key}`]
        return typeof value === "string" && value.length > 0 ? value : null
    }

    const settings: InvoiceSettings = {
        company_name: pick("company_name"),
        logo_url: pick("logo_url"),
        company_email: pick("company_email"),
        company_phone: pick("company_phone"),
        company_website: pick("company_website"),
        company_address: pick("company_address"),
        company_tax_id: pick("company_tax_id"),
        number_prefix: pick("number_prefix"),
        footer_note: pick("footer_note"),
    }

    return {...query, settings}
}

export function usePlatformSettings() {
    const query = usePublicSettings("platform")
    const raw = query.data ?? {}
    const pick = (key: string): string | null => {
        const value = raw[`platform.${key}`]
        return typeof value === "string" && value.length > 0 ? value : null
    }

    return {
        ...query,
        name: pick("name") ?? "Central",
        supportEmail: pick("support_email"),
    }
}

export function useSettingGroups() {
    return useQuery({
        queryKey: ["central", "settings", "groups"],
        queryFn: ({signal}) => getSettingGroups(signal),
        ...catalogQueryOptions,
    })
}

export function useGroupedSettings(params?: {
    group?: string
    search?: string
    public?: boolean
}) {
    return useQuery({
        queryKey: ["central", "settings", "grouped", params ?? {}],
        queryFn: ({signal}) => getGroupedSettings(params, signal),
        enabled: !params?.group || params.group.length > 0,
        staleTime: 60_000,
    })
}

export function useUpdateSetting() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, value}: { id: number; value: unknown }) =>
            updateSetting(id, {value}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "settings"]})
        },
    })
}

export function useBulkUpdateSettings() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: Record<string, unknown>) =>
            bulkUpdateSettings(values),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["central", "settings"]})
        },
    })
}

export function useSendTestMail() {
    return useMutation({
        mutationFn: ({email}: { email: string }) => sendTestMail(email),
    })
}
