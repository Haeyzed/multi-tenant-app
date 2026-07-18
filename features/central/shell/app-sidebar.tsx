"use client"

import { NavGroup } from "@/components/layout/nav-group"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/features/central/shell/nav-user"
import { sidebarData } from "@/features/central/shell/sidebar-data"
import { TeamSwitcher } from "@/features/central/shell/team-switcher"
import { useDirection } from "@/lib/providers/direction-provider"
import { useLayout } from "@/lib/providers/layout-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { collapsible, variant } = useLayout()
  const { dir } = useDirection()

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      side={dir === "rtl" ? "right" : "left"}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
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
