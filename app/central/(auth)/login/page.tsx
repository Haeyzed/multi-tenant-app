import type { Metadata } from "next"
import {LoginForm} from "@/features/central/auth/components/login-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the central platform.",
}

export default function LoginPage() {
    return <LoginForm/>
}
