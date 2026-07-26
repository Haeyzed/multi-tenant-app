"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"

import { PhoneInput } from "@/components/reui/phone-input"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
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
import {
  useCreateTenant,
  useUpdateTenant,
} from "@/features/central/tenants/hooks/use-tenant-query"
import {
  type StoreTenantFormValues,
  storeTenantSchema,
  type UpdateTenantFormValues,
} from "@/features/central/tenants/schemas"
import { tenantCreateStatusOptions } from "@/features/central/tenants/options"
import {
  findSelectOption,
  type SelectOption,
} from "@/features/central/shared/select-option"
import { handleFormApiError } from "@/lib/form-api-errors"
import { getTenantBaseDomain } from "@/lib/tenant-domain"
import { toastApiSuccess } from "@/lib/toast-api"
import type { Tenant, TenantStatus } from "@/features/central/tenants/types"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { permissions } from "@/features/central/auth/permissions"
import { LockIcon } from "lucide-react"

type TenantsFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Tenant
}

function parseDateString(value?: string | null): Date | undefined {
  if (!value) {
    return undefined
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function toDateValue(date: Date | undefined): string | null {
  if (!date) {
    return null
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function TenantsFormDialog({
  open,
  onOpenChange,
  currentRow,
}: TenantsFormDialogProps) {
  const isUpdate = !!currentRow
  const createTenant = useCreateTenant()
  const updateTenant = useUpdateTenant()
  const isSubmitting = createTenant.isPending || updateTenant.isPending
  const tenantBaseDomain = getTenantBaseDomain()

  const form = useForm<StoreTenantFormValues>({
    resolver: zodResolver(storeTenantSchema),
    defaultValues: {
      name: "",
      slug: "",
      email: "",
      phone: "",
      status: "pending",
      subdomain: "",
      trial_ends_at: null,
    },
  })

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        slug: currentRow.slug,
        email: currentRow.email || "",
        phone: currentRow.phone || "",
        trial_ends_at: currentRow.trial_ends_at
          ? currentRow.trial_ends_at.slice(0, 10)
          : null,
      })
    } else {
      form.reset({
        name: "",
        slug: "",
        email: "",
        phone: "",
        status: "pending",
        subdomain: "",
        trial_ends_at: null,
      })
    }
  }, [open, currentRow, form])

  const nameValue = form.watch("name")
  const statusValue = form.watch("status")
  const trialEndsAt = form.watch("trial_ends_at")

  React.useEffect(() => {
    if (isUpdate || !nameValue) {
      return
    }

    const generatedSlug = nameValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

    form.setValue("slug", generatedSlug, {
      shouldValidate: true,
      shouldDirty: true,
    })
    form.setValue("subdomain", generatedSlug, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [nameValue, isUpdate, form])

  const selectedStatus =
    tenantCreateStatusOptions.find((option) => option.value === statusValue) ??
    null

  const onSubmit = (data: StoreTenantFormValues) => {
    if (isUpdate && currentRow) {
      const updateValues: UpdateTenantFormValues = {
        name: data.name,
        slug: data.slug,
        email: data.email,
        phone: data.phone,
        trial_ends_at: data.trial_ends_at,
      }

      updateTenant.mutate(
        { id: currentRow.id, values: updateValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Tenant updated successfully")
            onOpenChange(false)
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update tenant")
          },
        }
      )
      return
    }

    createTenant.mutate(data, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "Tenant created successfully")
        onOpenChange(false)
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Failed to create tenant")
      },
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit tenant" : "Create tenant"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update organization details for this tenant."
              : "Provision a new tenant organization on the platform."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="tenant-form"
          className="max-h-[65vh] space-y-4 overflow-y-auto pe-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input {...form.register("name")} placeholder="Acme Commerce" />
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
              <FieldLabel>Slug</FieldLabel>
              <FieldContent>
                <Input {...form.register("slug")} placeholder="acme-commerce" />
                <FieldError
                  errors={
                    form.formState.errors.slug
                      ? [form.formState.errors.slug]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <Input
                    type="email"
                    {...form.register("email")}
                    placeholder="owner@acme.test"
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
            </div>

            {!isUpdate ? (
              <>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <FieldContent>
                    <Combobox
                      items={tenantCreateStatusOptions}
                      itemToStringValue={(item: SelectOption<TenantStatus>) =>
                        item.label
                      }
                      value={selectedStatus}
                      onValueChange={(
                        item: SelectOption<TenantStatus> | null
                      ) => {
                        form.setValue("status", item?.value ?? "pending", {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }}
                    >
                      <ComboboxInput placeholder="Select status..." />
                      <ComboboxContent>
                        <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item: SelectOption<TenantStatus>) => (
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

                <Field>
                  <FieldLabel>Primary domain</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        placeholder="acme"
                        {...form.register("subdomain")}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>.{tenantBaseDomain}</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError
                      errors={
                        form.formState.errors.subdomain
                          ? [form.formState.errors.subdomain]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>
              </>
            ) : null}

            <Field>
              <FieldLabel>Trial ends at</FieldLabel>
              <FieldContent>
                <DatePicker
                  selected={parseDateString(trialEndsAt)}
                  onSelect={(date) => {
                    form.setValue("trial_ends_at", toDateValue(date), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }}
                  placeholder="Pick trial end date"
                  minDate={new Date("1900-01-01")}
                  maxDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() + 5)
                    )
                  }
                />
                <FieldError
                  errors={
                    form.formState.errors.trial_ends_at
                      ? [form.formState.errors.trial_ends_at]
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
                ? permissions.tenants.update
                : permissions.tenants.create,
            ]}
            fallback={
              <Button disabled variant="outline">
                <LockIcon className="mr-1.5 size-3.5" />
                {isUpdate ? "Save changes (Locked)" : "Create tenant (Locked)"}
              </Button>
            }
          >
            <Button type="submit" form="tenant-form" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : null}
              {isUpdate ? "Save changes" : "Create tenant"}
            </Button>
          </PermissionGate>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
