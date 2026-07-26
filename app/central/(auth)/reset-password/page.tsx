import type { Metadata } from "next"
import {Suspense} from "react"
import {ResetPasswordForm} from "@/features/central/auth/components/reset-password-form"
import {Spinner} from "@/components/ui/spinner"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your account.",
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center py-8">
                    <Spinner/>
                </div>
            }
        >
            <ResetPasswordForm/>
        </Suspense>
    )
}
