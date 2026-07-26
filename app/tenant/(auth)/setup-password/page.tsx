import { Suspense } from "react"

import { SetupPasswordForm } from "@/features/tenant/auth/components/setup-password-form"
import { Spinner } from "@/components/ui/spinner"

export default function TenantSetupPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      }
    >
      <SetupPasswordForm />
    </Suspense>
  )
}
