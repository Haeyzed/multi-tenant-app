"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Spinner } from "@/components/ui/spinner"
import { useSuspendTenant } from "@/features/central/tenants/hooks/use-tenant-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { Tenant } from "@/features/central/tenants/types"

type TenantsSuspendDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant
  onSuccess: () => void
}

export function TenantsSuspendDialog({
  open,
  onOpenChange,
  tenant,
  onSuccess,
}: TenantsSuspendDialogProps) {
  const suspendTenant = useSuspendTenant()
  const [reason, setReason] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setReason("")
    }
  }, [open])

  const runSuspend = () => {
    suspendTenant.mutate(
      { id: tenant.id, reason: reason || undefined },
      {
        onSuccess: (result) => {
          toastApiSuccess(
            result.message,
            `Tenant "${tenant.name}" suspended successfully`
          )
          onSuccess()
        },
        onError: (error) => {
          toastApiError(error, "Failed to suspend tenant")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Suspend tenant</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Suspend <strong>{tenant.name}</strong> and block platform access.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="space-y-2">
          <Input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            variant="destructive"
            disabled={suspendTenant.isPending}
            onClick={runSuspend}
          >
            {suspendTenant.isPending ? <Spinner /> : null}
            Suspend
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
