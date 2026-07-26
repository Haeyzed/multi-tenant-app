import type { Metadata } from "next"
import {TwoFactorForm} from "@/features/central/auth/components/two-factor-form"

export const metadata: Metadata = {
  title: "Two-factor authentication",
  description: "Confirm your identity with a two-factor code.",
}

export default function TwoFactorPage() {
    return <TwoFactorForm/>
}
