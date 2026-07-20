"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
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
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { permissions } from "@/features/central/auth/components/permissions"
import {
  useCreatePermission,
  useUpdatePermission,
} from "@/features/central/permissions/hooks/use-permission-query"
import {
  type StorePermissionFormValues,
  storePermissionSchema,
  type UpdatePermissionFormValues,
} from "@/features/central/permissions/schemas"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiSuccess } from "@/lib/toast-api"
import type { PermissionItem } from "@/types/central/rbac"

type PermissionsFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: PermissionItem
}

export function PermissionsFormDialog({
                                        open,
                                        onOpenChange,
                                        currentRow,
                                      }: PermissionsFormDialogProps) {
  const isUpdate = !!currentRow
  const createPermission = useCreatePermission()
  const updatePermission = useUpdatePermission()
  const isSubmitting = createPermission.isPending || updatePermission.isPending

  const form = useForm<StorePermissionFormValues>({
    resolver: zodResolver(storePermissionSchema),
    defaultValues: {
      name: "",
    },
  })

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (currentRow) {
      form.reset({ name: currentRow.name })
    } else {
      form.reset({ name: "" })
    }
  }, [open, currentRow, form])

  const onSubmit = (data: StorePermissionFormValues) => {
    if (isUpdate && currentRow) {
      const values: UpdatePermissionFormValues = { name: data.name }
      updatePermission.mutate(
          { id: currentRow.id, values },
          {
            onSuccess: (result) => {
              toastApiSuccess(result.message, "Permission updated successfully")
              onOpenChange(false)
            },
            onError: (error) => {
              handleFormApiError(
                  error,
                  form.setError,
                  "Failed to update permission"
              )
            },
          }
      )
      return
    }

    createPermission.mutate(data, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "Permission created successfully")
        onOpenChange(false)
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Failed to create permission")
      },
    })
  }

  return (
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="sm:max-w-lg">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {isUpdate ? "Edit permission" : "Create permission"}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {isUpdate
                  ? "Update the permission identifier."
                  : "Add a new dot-namespaced permission to the catalog."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
              id="permission-form"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                  <Input
                      {...form.register("name")}
                      placeholder="reports.export"
                      className="font-mono"
                  />
                  <FieldError
                      errors={
                        form.formState.errors.name
                            ? [form.formState.errors.name]
                            : []
                      }
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </form>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
                render={<Button variant="outline">Cancel</Button>}
            />
            <PermissionGate
                permissions={[
                  isUpdate
                      ? permissions.users.permissions.update
                      : permissions.users.permissions.create,
                ]}
                fallback={
                  <Button disabled variant="outline">
                    <LockIcon className="mr-1.5 size-3.5" />
                    {isUpdate ? "Save changes (Locked)" : "Create permission (Locked)"}
                  </Button>
                }
            >
              <Button type="submit" form="permission-form" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : null}
                {isUpdate ? "Save changes" : "Create permission"}
              </Button>
            </PermissionGate>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
  )
}