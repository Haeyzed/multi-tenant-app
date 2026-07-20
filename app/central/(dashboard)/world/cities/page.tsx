"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { CitiesDialogs } from "@/features/central/world/cities/components/cities-dialogs"
import { CitiesPrimaryButtons } from "@/features/central/world/cities/components/cities-primary-buttons"
import { CitiesProvider } from "@/features/central/world/cities/components/cities-provider"
import { CitiesStats } from "@/features/central/world/cities/components/cities-stats"
import { CitiesTable } from "@/features/central/world/cities/components/cities-table"
import {Header} from "@/components/layout/header";
import {Search} from "@/components/search";
import {ThemeSwitch} from "@/components/theme-switch";
import {ConfigDrawer} from "@/components/config-drawer";
import {ProfileDropdown} from "@/features/central/shell/profile-dropdown";
import {Main} from "@/components/layout/main";
import {permissions} from "@/features/central/auth/components/permissions";

export default function CitiesPage() {
  return (
    <CentralAuthGuard permissions={permissions.world.view}>
      <CitiesProvider>
        <Header fixed>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <PageHeader
            title="Cities"
            description="Manage city reference data by state and country."
          >
            <CitiesPrimaryButtons />
          </PageHeader>
          <CitiesStats />
          <CitiesTable />
          <CitiesDialogs />
        </Main>
      </CitiesProvider>
    </CentralAuthGuard>
  )
}
