import {
  Building2Icon,
  CreditCardIcon,
  GalleryVerticalEndIcon,
  GlobeIcon,
  HeartPulseIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  SettingsIcon,
  ShieldIcon,
  UserRoundIcon,
} from "lucide-react"

import type { SidebarData } from "@/components/layout/types"
import { permissions } from "@/features/central/auth/permissions"
import { centralRoutes } from "@/features/central/shell/routes"

/**
 * Central sidebar — grouped by operator workflow.
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
      title: "General",
      items: [
        {
          title: "Overview",
          url: centralRoutes.dashboard,
          icon: LayoutDashboardIcon,
          permissions: [permissions.dashboard.view],
        },
        {
          title: "Tenants",
          url: centralRoutes.tenants,
          icon: Building2Icon,
          permissions: [permissions.tenants.view],
        },
      ],
    },
    {
      title: "Billing",
      items: [
        {
          title: "Catalog",
          icon: CreditCardIcon,
          permissions: [
            permissions.plans.view,
            permissions.features.view,
          ],
          items: [
            {
              title: "Plans",
              url: centralRoutes.billing.plans,
              permissions: [permissions.plans.view],
            },
            {
              title: "Features",
              url: centralRoutes.billing.features,
              permissions: [permissions.features.view],
            },
            {
              title: "Feature categories",
              url: centralRoutes.billing.featureCategories,
              permissions: [permissions.features.view],
            },
          ],
        },
        {
          title: "Operations",
          icon: ReceiptIcon,
          permissions: [
            permissions.subscriptions.view,
            permissions.billing.invoices.view,
            permissions.billing.payments.view,
          ],
          items: [
            {
              title: "Subscriptions",
              url: centralRoutes.billing.subscriptions,
              permissions: [permissions.subscriptions.view],
            },
            {
              title: "Invoices",
              url: centralRoutes.billing.invoices,
              permissions: [permissions.billing.invoices.view],
            },
            {
              title: "Payments",
              url: centralRoutes.billing.payments,
              permissions: [permissions.billing.payments.view],
            },
          ],
        },
      ],
    },
    {
      title: "Access",
      items: [
        {
          title: "Users",
          url: centralRoutes.users,
          icon: UserRoundIcon,
          permissions: [permissions.users.view],
        },
        {
          title: "Roles",
          url: centralRoutes.roles,
          icon: ShieldIcon,
          permissions: [permissions.roles.view],
        },
        {
          title: "Permissions",
          url: centralRoutes.permissions,
          icon: KeyRoundIcon,
          permissions: [permissions.permissions.view],
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
          permissions: [permissions.monitoring.view],
        },
        {
          title: "World",
          icon: GlobeIcon,
          permissions: [permissions.world.view],
          items: [
            {
              title: "Countries",
              url: centralRoutes.world.countries,
              permissions: [permissions.world.view],
            },
            {
              title: "States",
              url: centralRoutes.world.states,
              permissions: [permissions.world.view],
            },
            {
              title: "Cities",
              url: centralRoutes.world.cities,
              permissions: [permissions.world.view],
            },
            {
              title: "Timezones",
              url: centralRoutes.world.timezones,
              permissions: [permissions.world.view],
            },
            {
              title: "Languages",
              url: centralRoutes.world.languages,
              permissions: [permissions.world.view],
            },
            {
              title: "Currencies",
              url: centralRoutes.world.currencies,
              permissions: [permissions.world.view],
            },
          ],
        },
        {
          title: "Settings",
          url: centralRoutes.settings,
          icon: SettingsIcon,
          permissions: [permissions.settings.view],
        },
      ],
    },
  ],
}
