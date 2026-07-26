"use client"

import { GalleryVerticalEndIcon } from "lucide-react"
import * as React from "react"

import { NavGroup } from "@/components/layout/nav-group"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useFilteredSidebarData } from "@/features/tenant/shell/hooks/use-filtered-sidebar-data"
import { NavUser } from "@/features/tenant/shell/nav-user"
import { sidebarData } from "@/features/tenant/shell/sidebar-data"
import { TeamSwitcher } from "@/features/tenant/shell/team-switcher"
import { useDirection } from "@/lib/providers/direction-provider"
import { useLayout } from "@/lib/providers/layout-provider"
import { useTenantAuth } from "@/lib/providers/tenant-auth-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { collapsible, variant } = useLayout()
  const { dir } = useDirection()
  const { user } = useTenantAuth()
  const filteredData = useFilteredSidebarData(sidebarData)

  const teams = React.useMemo(
    () => [
      {
        name: user?.name ? `${user.name}'s store` : (filteredData.teams[0]?.name ?? "Tenant"),
        logo: filteredData.teams[0]?.logo ?? GalleryVerticalEndIcon,
        plan: filteredData.teams[0]?.plan ?? "Store",
      },
    ],
    [filteredData.teams, user?.name]
  )

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      side={dir === "rtl" ? "right" : "left"}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredData.navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
