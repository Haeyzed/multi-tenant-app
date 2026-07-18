import {
  Building2Icon,
  CreditCardIcon,
  GalleryVerticalEndIcon,
  GlobeIcon,
  HeartPulseIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react"

import type { SidebarData } from "@/components/layout/types"
import { centralRoutes } from "@/features/central/shell/routes"

/**
 * Central sidebar — grouped to mirror API service folders under
 * `App\Services\Central\{Dashboard,Tenants,Billing,Users,...}`.
 */
export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Central",
      logo: GalleryVerticalEndIcon,
      plan: "Enterprise",
    },
  ],
  navGroups: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: centralRoutes.dashboard,
          icon: LayoutDashboardIcon,
        },
      ],
    },
    {
      title: "Tenants",
      items: [
        {
          title: "Tenants",
          url: centralRoutes.tenants,
          icon: Building2Icon,
        },
      ],
    },
    {
      title: "Billing",
      items: [
        {
          title: "Catalog",
          icon: CreditCardIcon,
          items: [
            { title: "Plans", url: centralRoutes.billing.plans },
            { title: "Features", url: centralRoutes.billing.features },
            {
              title: "Feature categories",
              url: centralRoutes.billing.featureCategories,
            },
          ],
        },
        {
          title: "Operations",
          icon: ReceiptIcon,
          items: [
            {
              title: "Subscriptions",
              url: centralRoutes.billing.subscriptions,
            },
            { title: "Invoices", url: centralRoutes.billing.invoices },
            { title: "Payments", url: centralRoutes.billing.payments },
          ],
        },
      ],
    },
    {
      title: "Users",
      items: [
        {
          title: "Accounts",
          icon: UserRoundIcon,
          items: [
            { title: "Users", url: centralRoutes.users },
            { title: "Roles", url: centralRoutes.roles },
            { title: "Permissions", url: centralRoutes.permissions },
          ],
        },
      ],
    },
    {
      title: "Platform",
      items: [
        {
          title: "Monitoring",
          url: centralRoutes.monitoring,
          icon: HeartPulseIcon,
        },
        {
          title: "World",
          icon: GlobeIcon,
          items: [
            { title: "Countries", url: centralRoutes.world.countries },
            { title: "States", url: centralRoutes.world.states },
            { title: "Cities", url: centralRoutes.world.cities },
            { title: "Timezones", url: centralRoutes.world.timezones },
            { title: "Languages", url: centralRoutes.world.languages },
            { title: "Currencies", url: centralRoutes.world.currencies },
          ],
        },
        {
          title: "Settings",
          url: centralRoutes.settings,
          icon: SettingsIcon,
        },
      ],
    },
  ],
}
