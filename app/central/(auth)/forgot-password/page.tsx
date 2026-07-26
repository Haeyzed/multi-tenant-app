import type { Metadata } from "next"
import {ForgotPasswordForm} from "@/features/central/auth/components/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your central account password.",
}

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm/>
}
