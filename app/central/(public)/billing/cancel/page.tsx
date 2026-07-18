import { Suspense } from "react"

import { Spinner } from "@/components/ui/spinner"
import { BillingCancelClient } from "@/features/central/billing/checkout/components/billing-cancel-client"

export default function BillingCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Spinner className="size-6" />
        </div>
      }
    >
      <BillingCancelClient />
    </Suspense>
  )
}
