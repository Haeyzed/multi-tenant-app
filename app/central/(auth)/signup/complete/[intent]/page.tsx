import type { Metadata } from "next"
import {Suspense} from "react"
import {Spinner} from "@/components/ui/spinner"
import {SignupCompleteClient} from "@/features/central/auth/components/signup-complete-client"

export const metadata: Metadata = {
  title: "Complete signup",
  description: "Finish creating your account.",
}

export default function SignupCompletePage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center py-12">
                    <Spinner className="size-6"/>
                </div>
            }
        >
            <SignupCompleteClient/>
        </Suspense>
    )
}
