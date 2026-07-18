import { redirect } from "next/navigation"

import { centralRoutes } from "@/features/central/shell/routes"

export default function Page() {
  redirect(centralRoutes.login)
}
