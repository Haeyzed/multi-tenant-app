import {Suspense} from "react"

import {Spinner} from "@/components/ui/spinner"
import {SignupCompleteClient} from "@/features/central/auth/components/signup-complete-client"

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
