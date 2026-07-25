import { GalleryVerticalEndIcon, LayoutDashboardIcon } from "lucide-react"

import type { SidebarData } from "@/components/layout/types"
import { permissions } from "@/features/tenant/auth/components/permissions"
import { tenantRoutes } from "@/features/tenant/shell/routes"

/**
 * Tenant sidebar — start with dashboard; add catalog/inventory groups as modules land.
 */
export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Tenant",
      logo: GalleryVerticalEndIcon,
      plan: "Store",
    },
  ],
  navGroups: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: tenantRoutes.dashboard,
          icon: LayoutDashboardIcon,
          permissions: [permissions.dashboard.view],
        },
      ],
    },
  ],
}
