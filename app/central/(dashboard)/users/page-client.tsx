"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {UsersBulkDialogs} from "@/features/central/users/components/users-bulk-dialogs"
import {UsersDialogs} from "@/features/central/users/components/users-dialogs"
import {UsersPrimaryButtons} from "@/features/central/users/components/users-primary-buttons"
import {UsersProvider} from "@/features/central/users/components/users-provider"
import {UsersStats} from "@/features/central/users/components/users-stats"
import {UsersTable} from "@/features/central/users/components/users-table"
import {permissions} from "@/features/central/auth/permissions"
import {Header} from "@/components/layout/header"
import {ThemeSwitch} from "@/components/theme-switch"
import {ConfigDrawer} from "@/components/config-drawer"
import {Main} from "@/components/layout/main"
import {Search} from "@/components/search"
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown"

export default function UsersPage() {
    return (
        <CentralAuthGuard permissions={permissions.users.view}>
            <UsersProvider>
                <Header fixed>
                    <Search className="me-auto"/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                    <PageHeader
                        title="Users"
                        description="Manage central platform administrators and staff."
                    >
                        <UsersPrimaryButtons/>
                    </PageHeader>
                    <UsersStats/>
                    <UsersTable/>
                    <UsersDialogs/>
                    <UsersBulkDialogs/>
                </Main>
            </UsersProvider>
        </CentralAuthGuard>
    )
}
