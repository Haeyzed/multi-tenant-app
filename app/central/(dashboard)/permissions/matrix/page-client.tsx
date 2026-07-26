"use client"

import Link from "next/link"
import {ArrowLeft} from "lucide-react"

import {PageHeader} from "@/components/layout/page-header"
import {Button} from "@/components/ui/button"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {PermissionsMatrixPanel} from "@/features/central/permissions/components/permissions-matrix-panel"
import {centralRoutes} from "@/features/central/shell/routes"
import {permissions} from "@/features/central/auth/permissions"
import {Header} from "@/components/layout/header"
import {ThemeSwitch} from "@/components/theme-switch"
import {ConfigDrawer} from "@/components/config-drawer"
import {Main} from "@/components/layout/main"
import {Search} from "@/components/search"
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown"

export default function PermissionMatrixPage() {
    return (
        <CentralAuthGuard permissions={permissions.permissions.view}>
            <Header fixed>
                <Search className="me-auto"/>
                <ThemeSwitch/>
                <ConfigDrawer/>
                <ProfileDropdown/>
            </Header>
            <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 px-0"
                        render={<Link href={centralRoutes.permissions}/>}
                    >
                        <ArrowLeft className="size-4"/>
                        Back to permissions
                    </Button>
                    <PageHeader
                        title="Permission matrix"
                        description="Review and edit role permissions across the catalog."
                    />
                </div>
                <PermissionsMatrixPanel/>
            </Main>
        </CentralAuthGuard>
    )
}
