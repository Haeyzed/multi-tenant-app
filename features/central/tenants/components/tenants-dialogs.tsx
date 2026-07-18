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
import { TenantsFormDialog } from "@/features/central/tenants/components/tenants-form-dialog"
import { useTenants } from "@/features/central/tenants/components/tenants-provider"
import { TenantsViewDialog } from "@/features/central/tenants/components/tenants-view-dialog"
import {
  useActivateTenant,
  useDeleteTenant,
  useSuspendTenant,
} from "@/features/central/tenants/hooks/use-tenant-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function TenantsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTenants()
  const deleteTenant = useDeleteTenant()
  const activateTenant = useActivateTenant()
  const suspendTenant = useSuspendTenant()
  const [suspendReason, setSuspendReason] = React.useState("")
  const [isMutating, setIsMutating] = React.useState(false)

  const handleClose = React.useCallback(() => {
    setOpen(null)
    setSuspendReason("")
    setTimeout(() => {
      setCurrentRow(null)
    }, 300)
  }, [setOpen, setCurrentRow])

  const runAction = (
    action: "delete" | "activate" | "suspend"
  ) => {
    if (!currentRow) {
      return
    }

    setIsMutating(true)

    const onSuccess = (message?: string) => {
      toastApiSuccess(
        message,
        `Tenant "${currentRow.name}" ${action}d successfully`
      )
      setIsMutating(false)
      handleClose()
    }

    const onError = (error: unknown) => {
      toastApiError(error, `Failed to ${action} tenant`)
      setIsMutating(false)
    }

    if (action === "delete") {
      deleteTenant.mutate(currentRow.id, { onSuccess: (r) => onSuccess(r.message), onError })
      return
    }

    if (action === "activate") {
      activateTenant.mutate(currentRow.id, {
        onSuccess: (r) => onSuccess(r.message),
        onError,
      })
      return
    }

    suspendTenant.mutate(
      { id: currentRow.id, reason: suspendReason || undefined },
      { onSuccess: (r) => onSuccess(r.message), onError }
    )
  }

  return (
    <>
      <TenantsFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <TenantsFormDialog
            key={`tenant-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <TenantsViewDialog
            key={`tenant-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            tenant={currentRow}
          />

          <ResponsiveDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Delete tenant</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Soft-delete <strong>{currentRow.name}</strong>? This can be
                  restored later from the API.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  disabled={isMutating}
                  onClick={() => runAction("delete")}
                >
                  {isMutating ? <Spinner /> : null}
                  Delete
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          <ResponsiveDialog
            open={open === "activate"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Activate tenant</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Activate <strong>{currentRow.name}</strong> and restore
                  platform access.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  disabled={isMutating}
                  onClick={() => runAction("activate")}
                >
                  {isMutating ? <Spinner /> : null}
                  Activate
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          <ResponsiveDialog
            open={open === "suspend"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Suspend tenant</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Suspend <strong>{currentRow.name}</strong> and block platform
                  access.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <div className="space-y-2">
                <Input
                  placeholder="Reason (optional)"
                  value={suspendReason}
                  onChange={(event) => setSuspendReason(event.target.value)}
                />
              </div>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  disabled={isMutating}
                  onClick={() => runAction("suspend")}
                >
                  {isMutating ? <Spinner /> : null}
                  Suspend
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </>
      ) : null}
    </>
  )
}
