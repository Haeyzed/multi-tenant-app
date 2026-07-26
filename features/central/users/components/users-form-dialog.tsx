"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"

import { AvatarUpload } from "@/components/reui/avatar-upload"
import { PhoneInput } from "@/components/reui/phone-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
import { permissions } from "@/features/central/auth/permissions"
import { useGetRoles } from "@/features/central/roles/hooks/use-role-query"
import {
  useCreateUser,
  useUpdateUser,
  useUploadUserAvatar,
} from "@/features/central/users/hooks/use-user-query"
import {
  type StoreUserFormValues,
  storeUserSchema,
  type UpdateUserFormValues,
} from "@/features/central/users/schemas"
import { userStatusOptions } from "@/features/central/users/options"
import {
  findSelectOption,
  type SelectOption,
} from "@/features/central/shared/select-option"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { CentralUser, UserStatus } from "@/types/central/user"
import { LockIcon } from "lucide-react"

type UsersFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: CentralUser
}

export function UsersFormDialog({
  open,
  onOpenChange,
  currentRow,
}: UsersFormDialogProps) {
  const isUpdate = !!currentRow
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const uploadAvatar = useUploadUserAvatar()
  const isSubmitting =
    createUser.isPending || updateUser.isPending || uploadAvatar.isPending
  const { data: rolesData } = useGetRoles(open)
  const roleOptions = rolesData?.data ?? []

  const form = useForm<StoreUserFormValues>({
    resolver: zodResolver(storeUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      timezone: "UTC",
      status: "active",
      roles: [],
      password: "",
      password_confirmation: "",
    },
  })

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        email: currentRow.email,
        phone: currentRow.phone || "",
        timezone: currentRow.timezone || "UTC",
        status: (currentRow.status as UserStatus) || "active",
        roles: currentRow.roles ?? [],
        password: "",
        password_confirmation: "",
      })
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        timezone: "UTC",
        status: "active",
        roles: [],
        password: "",
        password_confirmation: "",
      })
    }
  }, [open, currentRow, form])

  const statusValue = form.watch("status")
  const selectedRoles = form.watch("roles") ?? []
  const selectedStatus =
    userStatusOptions.find((option) => option.value === statusValue) ?? null

  const handleAvatarUpload = (file: File) => {
    if (!currentRow) {
      return
    }

    uploadAvatar.mutate(
      { id: currentRow.id, file },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Avatar uploaded successfully")
        },
        onError: (error) => {
          toastApiError(error, "Failed to upload avatar")
        },
      }
    )
  }

  const onSubmit = (data: StoreUserFormValues) => {
    if (isUpdate && currentRow) {
      const updateValues: UpdateUserFormValues = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        timezone: data.timezone,
        roles: data.roles,
      }

      updateUser.mutate(
        { id: currentRow.id, values: updateValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "User updated successfully")
            onOpenChange(false)
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update user")
          },
        }
      )
      return
    }

    createUser.mutate(data, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "User created successfully")
        onOpenChange(false)
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Failed to create user")
      },
    })
  }

  const toggleRole = (roleName: string, checked: boolean) => {
    const next = checked
      ? [...selectedRoles, roleName]
      : selectedRoles.filter((role) => role !== roleName)
    form.setValue("roles", next, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit user" : "Create user"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update profile details for this central user."
              : "Invite a new central platform administrator or staff member."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="user-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            {isUpdate && currentRow ? (
              <Field>
                <FieldLabel>Avatar</FieldLabel>
                <FieldContent>
                  <AvatarUpload
                    defaultAvatar={currentRow.avatar_url}
                    onFileChange={(file) => {
                      if (file) {
                        handleAvatarUpload(file)
                      }
                    }}
                    disabled={uploadAvatar.isPending}
                  />
                </FieldContent>
              </Field>
            ) : null}

            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input {...form.register("name")} placeholder="Jane Admin" />
                <FieldError
                  errors={
                    form.formState.errors.name
                      ? [form.formState.errors.name]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  {...form.register("email")}
                  placeholder="jane@example.com"
                />
                <FieldError
                  errors={
                    form.formState.errors.email
                      ? [form.formState.errors.email]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneInput
                        placeholder="Enter phone number"
                        defaultCountry="NG"
                        value={field.value || undefined}
                        onChange={(value) => field.onChange(value || "")}
                      />
                    )}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.phone
                        ? [form.formState.errors.phone]
                        : []
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Timezone</FieldLabel>
                <FieldContent>
                  <Input {...form.register("timezone")} placeholder="UTC" />
                  <FieldError
                    errors={
                      form.formState.errors.timezone
                        ? [form.formState.errors.timezone]
                        : []
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            {!isUpdate ? (
              <>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <FieldContent>
                    <Combobox
                      items={userStatusOptions}
                      itemToStringValue={(item: SelectOption<UserStatus>) =>
                        item.label
                      }
                      value={selectedStatus}
                      onValueChange={(
                        item: SelectOption<UserStatus> | null
                      ) => {
                        form.setValue("status", item?.value ?? "active", {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }}
                    >
                      <ComboboxInput placeholder="Select status..." />
                      <ComboboxContent>
                        <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item: SelectOption<UserStatus>) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldError
                      errors={
                        form.formState.errors.status
                          ? [form.formState.errors.status]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Password (optional)</FieldLabel>
                    <FieldContent>
                      <Input
                        type="password"
                        {...form.register("password")}
                        placeholder="Leave blank to auto-generate"
                      />
                      <FieldError
                        errors={
                          form.formState.errors.password
                            ? [form.formState.errors.password]
                            : []
                        }
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Confirm password</FieldLabel>
                    <FieldContent>
                      <Input
                        type="password"
                        {...form.register("password_confirmation")}
                        placeholder="Confirm password"
                      />
                      <FieldError
                        errors={
                          form.formState.errors.password_confirmation
                            ? [form.formState.errors.password_confirmation]
                            : []
                        }
                      />
                    </FieldContent>
                  </Field>
                </div>
              </>
            ) : null}

            <PermissionGate permissions={[permissions.users.assignRoles]}>
              <Field>
                <FieldLabel>Roles</FieldLabel>
                <FieldContent>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                    {roleOptions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No roles available.
                      </p>
                    ) : (
                      roleOptions.map((role) => (
                        <label
                          key={role.id}
                          className="flex items-center gap-2 text-sm capitalize"
                        >
                          <Checkbox
                            checked={selectedRoles.includes(role.name)}
                            onCheckedChange={(checked) =>
                              toggleRole(role.name, !!checked)
                            }
                          />
                          {role.name}
                        </label>
                      ))
                    )}
                  </div>
                  <FieldError
                    errors={
                      form.formState.errors.roles
                        ? [form.formState.errors.roles]
                        : []
                    }
                  />
                </FieldContent>
              </Field>
            </PermissionGate>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <PermissionGate
            permissions={[
              isUpdate ? permissions.users.update : permissions.users.create,
            ]}
            fallback={
              <Button disabled variant="outline">
                <LockIcon className="mr-1.5 size-3.5" />
                {isUpdate ? "Save changes (Locked)" : "Create user (Locked)"}
              </Button>
            }
          >
            <Button type="submit" form="user-form" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : null}
              {isUpdate ? "Save changes" : "Create user"}
            </Button>
          </PermissionGate>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
