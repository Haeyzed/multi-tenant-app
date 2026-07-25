"use client"

import {GalleryVerticalEndIcon} from "lucide-react"
import Link from "next/link"

import {Skeleton} from "@/components/ui/skeleton"
import {usePlatformSettings} from "@/features/central/settings/hooks/use-setting-query"
import {centralRoutes} from "@/features/central/shell/routes"

export default function PublicBillingLayout({
                                                children,
                                            }: {
    children: React.ReactNode
}) {
    const {name, isLoading} = usePlatformSettings()

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
            <Link
                href={centralRoutes.login}
                className="flex items-center gap-2 font-medium"
            >
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                    <GalleryVerticalEndIcon className="size-4"/>
                </div>
                {isLoading ? <Skeleton className="h-5 w-28"/> : name}
            </Link>
            <div className="w-full max-w-3xl">{children}</div>
        </div>
    )
}
