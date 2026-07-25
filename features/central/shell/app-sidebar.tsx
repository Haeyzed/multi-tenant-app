"use client"

import {GalleryVerticalEndIcon} from "lucide-react"
import * as React from "react"

import {NavGroup} from "@/components/layout/nav-group"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {usePlatformSettings} from "@/features/central/settings/hooks/use-setting-query"
import {useFilteredSidebarData} from "@/features/central/shell/hooks/use-filtered-sidebar-data"
import {NavUser} from "@/features/central/shell/nav-user"
import {sidebarData} from "@/features/central/shell/sidebar-data"
import {TeamSwitcher} from "@/features/central/shell/team-switcher"
import {useDirection} from "@/lib/providers/direction-provider"
import {useLayout} from "@/lib/providers/layout-provider"

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {collapsible, variant} = useLayout()
    const {dir} = useDirection()
    const filteredData = useFilteredSidebarData(sidebarData)
    const {name, isLoading} = usePlatformSettings()

    React.useEffect(() => {
        if (!isLoading && name) {
            document.title = name
        }
    }, [isLoading, name])

    const teams = React.useMemo(
        () => [
            {
                name: isLoading ? filteredData.teams[0]?.name ?? "Central" : name,
                logo: filteredData.teams[0]?.logo ?? GalleryVerticalEndIcon,
                plan: filteredData.teams[0]?.plan ?? "Enterprise",
            },
        ],
        [filteredData.teams, isLoading, name],
    )

    return (
        <Sidebar
            collapsible={collapsible}
            variant={variant}
            side={dir === "rtl" ? "right" : "left"}
            {...props}
        >
            <SidebarHeader>
                <TeamSwitcher teams={teams}/>
            </SidebarHeader>
            <SidebarContent>
                {filteredData.navGroups.map((group) => (
                    <NavGroup key={group.title} {...group} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
