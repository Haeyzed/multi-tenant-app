import { Suspense } from "react"

import { ImpersonateRedeem } from "@/features/tenant/auth/components/impersonate-redeem"
import { Spinner } from "@/components/ui/spinner"

export default function TenantImpersonatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      }
    >
      <ImpersonateRedeem />
    </Suspense>
  )
}
