"use client"

import * as React from "react"

import { Alert, AlertDescription } from "@/components/reui/alert"
import { Button } from "@/components/ui/button"
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
import { RolesAssignPermissionsDialog } from "@/features/central/roles/components/roles-assign-permissions-dialog"
import { RolesFormDialog } from "@/features/central/roles/components/roles-form-dialog"
import { useRoles } from "@/features/central/roles/components/roles-provider"
import { RolesViewDialog } from "@/features/central/roles/components/roles-view-dialog"
import { useDeleteRole } from "@/features/central/roles/hooks/use-role-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function RolesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRoles()
  const deleteRole = useDeleteRole()
  const [isMutating, setIsMutating] = React.useState(false)

  const handleClose = React.useCallback(() => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 300)
  }, [setOpen, setCurrentRow])

  const runDelete = () => {
    if (!currentRow || currentRow.name === "super-admin") {
      return
    }

    setIsMutating(true)
    deleteRole.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Role "${currentRow.name}" deleted successfully`
        )
        setIsMutating(false)
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete role")
        setIsMutating(false)
      },
    })
  }

  return (
    <>
      <RolesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <RolesFormDialog
            key={`role-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <RolesViewDialog
            key={`role-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            role={currentRow}
          />

          <RolesAssignPermissionsDialog
            key={`role-assign-permissions-${currentRow.id}`}
            open={open === "assignPermissions"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            role={currentRow}
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
                <ResponsiveDialogTitle>Delete role</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Delete <strong>{currentRow.name}</strong>? Users assigned to
                  this role will lose it.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>

              {currentRow.name === "super-admin" ? (
                <Alert variant="warning">
                  <AlertDescription>
                    The super-admin role is protected and cannot be deleted.
                  </AlertDescription>
                </Alert>
              ) : null}

              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  disabled={isMutating || currentRow.name === "super-admin"}
                  onClick={runDelete}
                >
                  {isMutating ? <Spinner /> : null}
                  Delete
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </>
      ) : null}
    </>
  )
}
