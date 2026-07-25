"use client"

import {GalleryVerticalEndIcon} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import {CentralGuestGuard} from "@/features/central/auth/components/guest-guard"
import {usePlatformSettings} from "@/features/central/settings/hooks/use-setting-query"
import {centralRoutes} from "@/features/central/shell/routes"
import {Skeleton} from "@/components/ui/skeleton"

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const {name, isLoading} = usePlatformSettings()

    React.useEffect(() => {
        if (!isLoading && name) {
            document.title = name
        }
    }, [isLoading, name])

    return (
        <CentralGuestGuard>
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <Link
                            href={centralRoutes.login}
                            className="flex items-center gap-2 font-medium"
                        >
                            <div
                                className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <GalleryVerticalEndIcon className="size-4"/>
                            </div>
                            {isLoading ? <Skeleton className="h-5 w-28"/> : name}
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-md">{children}</div>
                    </div>
                </div>
                <div className="relative hidden bg-muted lg:block">
                    <img
                        src="/placeholder.svg"
                        alt="Authentication background placeholder"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </CentralGuestGuard>
    )
}
