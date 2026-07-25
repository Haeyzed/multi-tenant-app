"use client"

import {useParams} from "next/navigation"

import {Spinner} from "@/components/ui/spinner"
import {ContentSection} from "@/features/central/settings/components/content-section"
import {SettingsGroupForm} from "@/features/central/settings/components/settings-group-form"
import {
    groupDescriptions,
    settingsGroupHref,
} from "@/features/central/settings/components/settings-sidebar-nav"
import {useGroupedSettings, useSettingGroups,} from "@/features/central/settings/hooks/use-setting-query"

export default function SettingsGroupPage() {
    const params = useParams<{ group: string }>()
    const group = params.group
    const {data: groups = [], isLoading: groupsLoading} = useSettingGroups()
    const {data: grouped = {}, isLoading: settingsLoading} = useGroupedSettings()

    const option = groups.find((item) => item.value === group)
    const title = option?.label ?? group
    const description =
        groupDescriptions[group] ??
        `Manage ${title.toLowerCase()} settings for the platform.`

    if (groupsLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner/> Loading setting group...
            </div>
        )
    }

    if (groups.length > 0 && !option) {
        return (
            <p className="text-sm text-muted-foreground">
                Unknown settings group. Try{" "}
                <a className="underline" href={settingsGroupHref(groups[0].value)}>
                    {groups[0].label}
                </a>
                .
            </p>
        )
    }

    return (
        <ContentSection
            title={title}
            desc={description}
            contentClassName={group === "billing" ? "lg:max-w-3xl" : undefined}
        >
            <SettingsGroupForm
                group={group}
                title={title}
                settings={grouped[group] ?? []}
                isLoading={settingsLoading}
            />
        </ContentSection>
    )
}
