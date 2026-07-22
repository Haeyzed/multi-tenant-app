import {Suspense} from "react"


import {Spinner} from "@/components/ui/spinner"

import {BillingSuccessClient} from "@/features/central/billing/checkout/components/billing-success-client"


export default function BillingSuccessPage() {

    return (

        <Suspense

            fallback={

                <div className="flex flex-col items-center gap-3 text-center">

                    <Spinner className="size-6"/>

                    <p className="text-muted-foreground text-sm">Loading…</p>

                </div>

            }

        >

            <BillingSuccessClient/>

        </Suspense>

    )

}


