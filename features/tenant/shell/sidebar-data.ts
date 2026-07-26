import {
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  TagsIcon,
} from "lucide-react"

import type { SidebarData } from "@/components/layout/types"
import { permissions } from "@/features/tenant/auth/permissions"
import { tenantRoutes } from "@/features/tenant/shell/routes"

/**
 * Tenant sidebar — dashboard + catalog stubs (CRUD modules land later).
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
      title: "General",
      items: [
        {
          title: "Overview",
          url: tenantRoutes.dashboard,
          icon: LayoutDashboardIcon,
          permissions: [permissions.dashboard.view],
        },
      ],
    },
    {
      title: "Catalog",
      permissions: [permissions.brands.view],
      items: [
        {
          title: "Brands",
          url: tenantRoutes.dashboard,
          icon: TagsIcon,
          permissions: [permissions.brands.view],
        },
      ],
    },
    {
      title: "Settings",
      permissions: [permissions.settings.view],
      items: [
        {
          title: "Store settings",
          url: tenantRoutes.dashboard,
          icon: SettingsIcon,
          permissions: [permissions.settings.view],
        },
      ],
    },
  ],
}
