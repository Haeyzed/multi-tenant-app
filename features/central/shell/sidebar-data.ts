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
import { permissions } from "@/features/central/auth/components/permissions"
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
          permissions: [permissions.dashboard.view],
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
            permissions.billing.plans.view,
            permissions.billing.features.view,
          ],
          items: [
            {
              title: "Plans",
              url: centralRoutes.billing.plans,
              permissions: [permissions.billing.plans.view],
            },
            {
              title: "Features",
              url: centralRoutes.billing.features,
              permissions: [permissions.billing.features.view],
            },
            {
              title: "Feature categories",
              url: centralRoutes.billing.featureCategories,
              permissions: [permissions.billing.features.view],
            },
          ],
        },
        {
          title: "Operations",
          icon: ReceiptIcon,
          permissions: [
            permissions.billing.subscriptions.view,
            permissions.billing.invoices.view,
            permissions.billing.payments.view,
          ],
          items: [
            {
              title: "Subscriptions",
              url: centralRoutes.billing.subscriptions,
              permissions: [permissions.billing.subscriptions.view],
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
      title: "Users",
      items: [
        {
          title: "Accounts",
          icon: UserRoundIcon,
          permissions: [
            permissions.users.accounts.view,
            permissions.users.roles.view,
            permissions.users.permissions.view,
          ],
          items: [
            {
              title: "Users",
              url: centralRoutes.users,
              permissions: [permissions.users.accounts.view],
            },
            {
              title: "Roles",
              url: centralRoutes.roles,
              permissions: [permissions.users.roles.view],
            },
            {
              title: "Permissions",
              url: centralRoutes.permissions,
              permissions: [permissions.users.permissions.view],
            },
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
          permissions: [permissions.platform.monitoring.view],
        },
        {
          title: "World",
          icon: GlobeIcon,
          permissions: [permissions.platform.world.view],
          items: [
            {
              title: "Countries",
              url: centralRoutes.world.countries,
              permissions: [permissions.platform.world.view],
            },
            {
              title: "States",
              url: centralRoutes.world.states,
              permissions: [permissions.platform.world.view],
            },
            {
              title: "Cities",
              url: centralRoutes.world.cities,
              permissions: [permissions.platform.world.view],
            },
            {
              title: "Timezones",
              url: centralRoutes.world.timezones,
              permissions: [permissions.platform.world.view],
            },
            {
              title: "Languages",
              url: centralRoutes.world.languages,
              permissions: [permissions.platform.world.view],
            },
            {
              title: "Currencies",
              url: centralRoutes.world.currencies,
              permissions: [permissions.platform.world.view],
            },
          ],
        },
        {
          title: "Settings",
          url: centralRoutes.settings,
          icon: SettingsIcon,
          permissions: [permissions.platform.settings.view],
        },
      ],
    },
  ],
}