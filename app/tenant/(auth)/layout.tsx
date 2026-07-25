"use client"

import { GalleryVerticalEndIcon } from "lucide-react"
import Link from "next/link"

import { TenantGuestGuard } from "@/features/tenant/auth/components/guest-guard"
import { tenantRoutes } from "@/features/tenant/shell/routes"

export default function TenantAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TenantGuestGuard>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link
              href={tenantRoutes.login}
              className="flex items-center gap-2 font-medium"
            >
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
              Tenant
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
    </TenantGuestGuard>
  )
}
