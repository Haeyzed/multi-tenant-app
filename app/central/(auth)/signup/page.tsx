import type { Metadata } from "next"
import {SignupForm} from "@/features/central/auth/components/signup-form"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a central platform account.",
}

export default function SignupPage() {
    return <SignupForm/>
}
