import Link from "next/link"

import { GalleryVerticalEndIcon } from "lucide-react"



import { centralRoutes } from "@/features/central/shell/routes"



export default function PublicBillingLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">

      <Link

        href={centralRoutes.login}

        className="flex items-center gap-2 font-medium"

      >

        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">

          <GalleryVerticalEndIcon className="size-4" />

        </div>

        Central Billing

      </Link>

      <div className="w-full max-w-3xl">{children}</div>

    </div>

  )

}

