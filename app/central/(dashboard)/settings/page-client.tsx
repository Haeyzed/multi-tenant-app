"use client"

import {useRouter} from "next/navigation"
import * as React from "react"

import {Spinner} from "@/components/ui/spinner"
import {settingsGroupHref} from "@/features/central/settings/components/settings-sidebar-nav"
import {useSettingGroups} from "@/features/central/settings/hooks/use-setting-query"

export default function SettingsIndexPage() {
    const router = useRouter()
    const {data: groups = [], isLoading} = useSettingGroups()

    React.useEffect(() => {
        const first = groups[0]?.value
        if (first) {
            router.replace(settingsGroupHref(first))
        }
    }, [groups, router])

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner/> {isLoading ? "Loading settings..." : "Opening settings..."}
        </div>
    )
}
