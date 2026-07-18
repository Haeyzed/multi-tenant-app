"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useInvoices } from "@/features/central/billing/invoices/components/invoices-provider"

export function InvoicesPrimaryButtons() {
  const { setOpen } = useInvoices()

  return (
    <PermissionGate permissions="billing.invoices.manage">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
