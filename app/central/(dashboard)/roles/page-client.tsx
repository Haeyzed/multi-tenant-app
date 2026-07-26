"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {RolesBulkDialogs} from "@/features/central/roles/components/roles-bulk-dialogs"
import {RolesDialogs} from "@/features/central/roles/components/roles-dialogs"
import {RolesPrimaryButtons} from "@/features/central/roles/components/roles-primary-buttons"
import {RolesProvider} from "@/features/central/roles/components/roles-provider"
import {RolesStats} from "@/features/central/roles/components/roles-stats"
import {RolesTable} from "@/features/central/roles/components/roles-table"
import {permissions} from "@/features/central/auth/permissions"
import {Header} from "@/components/layout/header"
import {ThemeSwitch} from "@/components/theme-switch"
import {ConfigDrawer} from "@/components/config-drawer"
import {Main} from "@/components/layout/main"
import {Search} from "@/components/search"
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown"

export default function RolesPage() {
    return (
        <CentralAuthGuard permissions={permissions.roles.view}>
            <RolesProvider>
                <Header fixed>
                    <Search className="me-auto"/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                    <PageHeader
                        title="Roles"
                        description="Manage platform roles and their permissions."
                    >
                        <RolesPrimaryButtons/>
                    </PageHeader>
                    <RolesStats/>
                    <RolesTable/>
                    <RolesDialogs/>
                    <RolesBulkDialogs/>
                </Main>
            </RolesProvider>
        </CentralAuthGuard>
    )
}
