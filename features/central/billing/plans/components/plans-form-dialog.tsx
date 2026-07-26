"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PlansFeaturesFields } from "@/features/central/billing/plans/components/plans-features-fields"
import { PlansPricesManager } from "@/features/central/billing/plans/components/plans-prices-manager"
import {
  useCreatePlan,
  useGetPlan,
  useUpdatePlan,
} from "@/features/central/billing/plans/hooks/use-plan-query"
import {
  type StorePlanFormValues,
  storePlanSchema,
  type UpdatePlanFormValues,
} from "@/features/central/billing/plans/schemas"
import {
  planBillingIntervalOptions,
  planStatusOptions,
  planVisibilityOptions,
} from "@/features/central/billing/plans/options"
import {
  findSelectOption,
  type SelectOption,
} from "@/features/central/shared/select-option"
import { useBillingDefaultInterval } from "@/features/central/settings/hooks/use-setting-query"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiSuccess } from "@/lib/toast-api"
import type {
  BillingInterval,
  FeatureLimitType,
  Plan,
  PlanStatus,
  PlanVisibility,
} from "@/features/central/billing/plans/types"

type PlansFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Plan
}

const defaults: StorePlanFormValues = {
  name: "",
  slug: "",
  description: "",
  billing_interval: "monthly",
  trial_days: 14,
  status: "active",
  visibility: "public",
  is_featured: false,
  sort_order: 0,
  features: [],
}

function mapPlanFeatures(plan: Plan): StorePlanFormValues["features"] {
  return (plan.features ?? []).map((feature) => {
    const limitType =
      (feature.pivot?.limit_type as FeatureLimitType | null | undefined) ??
      (feature.default_limit_type as FeatureLimitType | null | undefined) ??
      "boolean"

    return {
      feature_id: feature.id,
      limit_type: limitType,
      limit_value:
        feature.pivot?.limit_value ?? feature.default_limit_value ?? null,
      is_unlimited: feature.pivot?.is_unlimited ?? limitType === "unlimited",
      is_enabled: feature.pivot?.is_enabled ?? true,
      tracks_usage:
        feature.pivot?.tracks_usage ?? feature.tracks_usage ?? false,
      reset_period:
        (feature.pivot?.reset_period as
          "monthly" | "quarterly" | "yearly" | null | undefined) ?? null,
    }
  })
}

export function PlansFormDialog({
  open,
  onOpenChange,
  currentRow,
}: PlansFormDialogProps) {
  const isUpdate = !!currentRow
  const createPlan = useCreatePlan()
  const updatePlan = useUpdatePlan()
  const { data: planDetails } = useGetPlan(currentRow?.id, open && isUpdate)
  const isSubmitting = createPlan.isPending || updatePlan.isPending
  const defaultBillingInterval = useBillingDefaultInterval()
  const initializedDialogRef = React.useRef<string | null>(null)

  const form = useForm<StorePlanFormValues>({
    resolver: zodResolver(storePlanSchema),
    defaultValues: defaults,
  })

  React.useEffect(() => {
    if (!open) {
      initializedDialogRef.current = null
      return
    }

    const source = planDetails ?? currentRow
    const dialogIdentity = currentRow
      ? `edit:${currentRow.id}:${planDetails ? "loaded" : "pending"}`
      : "new"

    if (currentRow && !planDetails) {
      return
    }

    if (initializedDialogRef.current === dialogIdentity) {
      return
    }
    initializedDialogRef.current = dialogIdentity

    if (source) {
      form.reset({
        name: source.name,
        slug: source.slug,
        description: source.description || "",
        billing_interval: source.billing_interval || defaultBillingInterval,
        trial_days: source.trial_days ?? 0,
        status: source.status,
        visibility: source.visibility,
        is_featured: source.is_featured,
        sort_order: source.sort_order ?? 0,
        features: mapPlanFeatures(source),
      })
    } else {
      form.reset({
        ...defaults,
        billing_interval: defaultBillingInterval,
      })
    }
  }, [open, currentRow, planDetails, defaultBillingInterval, form])

  React.useEffect(() => {
    if (open && !currentRow && !form.formState.isDirty) {
      form.setValue("billing_interval", defaultBillingInterval)
    }
  }, [open, currentRow, defaultBillingInterval, form, form.formState.isDirty])

  const nameValue = form.watch("name")

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
  }, [nameValue, isUpdate, form])

  const onSubmit = (data: StorePlanFormValues) => {
    if (isUpdate && currentRow) {
      const values: UpdatePlanFormValues = data
      updatePlan.mutate(
        { id: currentRow.id, values },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Plan updated successfully")
            onOpenChange(false)
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update plan")
          },
        }
      )
      return
    }

    createPlan.mutate(data, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "Plan created successfully")
        onOpenChange(false)
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Failed to create plan")
      },
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit plan" : "Create plan"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update plan details, features, and currency prices below."
              : "Define a billing plan and attach features. Add currency prices after saving."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="max-h-[65vh] space-y-4 overflow-y-auto pe-1">
          <form
            id="plan-form"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                  <Input {...form.register("name")} placeholder="Growth" />
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
                  <Input {...form.register("slug")} placeholder="growth" />
                  <FieldError
                    errors={
                      form.formState.errors.slug
                        ? [form.formState.errors.slug]
                        : []
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Best for growing teams"
                    rows={3}
                  />
                </FieldContent>
              </Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Billing interval</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={form.control}
                      name="billing_interval"
                      render={({ field }) => {
                        const selected =
                          planBillingIntervalOptions.find(
                            (option) => option.value === field.value
                          ) ?? null
                        return (
                          <Combobox
                            items={planBillingIntervalOptions}
                            itemToStringValue={(
                              item: SelectOption<BillingInterval>
                            ) => item.label}
                            value={selected}
                            onValueChange={(
                              item: SelectOption<BillingInterval> | null
                            ) =>
                              field.onChange(
                                item?.value ?? defaultBillingInterval
                              )
                            }
                          >
                            <ComboboxInput placeholder="Select interval..." />
                            <ComboboxContent>
                              <ComboboxEmpty>No intervals found.</ComboboxEmpty>
                              <ComboboxList>
                                {(item: SelectOption<BillingInterval>) => (
                                  <ComboboxItem key={item.value} value={item}>
                                    {item.label}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                        )
                      }}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Trial days</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      min="0"
                      max="365"
                      {...form.register("trial_days", {
                        valueAsNumber: true,
                      })}
                    />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={form.control}
                      name="status"
                      render={({ field }) => {
                        const selected =
                          planStatusOptions.find(
                            (option) => option.value === field.value
                          ) ?? null
                        return (
                          <Combobox
                            items={planStatusOptions}
                            itemToStringValue={(item: SelectOption<PlanStatus>) =>
                              item.label
                            }
                            value={selected}
                            onValueChange={(item: SelectOption<PlanStatus> | null) =>
                              field.onChange(item?.value ?? "active")
                            }
                          >
                            <ComboboxInput placeholder="Select status..." />
                            <ComboboxContent>
                              <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                              <ComboboxList>
                                {(item: SelectOption<PlanStatus>) => (
                                  <ComboboxItem key={item.value} value={item}>
                                    {item.label}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                        )
                      }}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Visibility</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={form.control}
                      name="visibility"
                      render={({ field }) => {
                        const selected =
                          planVisibilityOptions.find(
                            (option) => option.value === field.value
                          ) ?? null
                        return (
                          <Combobox
                            items={planVisibilityOptions}
                            itemToStringValue={(item: SelectOption<PlanVisibility>) =>
                              item.label
                            }
                            value={selected}
                            onValueChange={(
                              item: SelectOption<PlanVisibility> | null
                            ) => field.onChange(item?.value ?? "public")}
                          >
                            <ComboboxInput placeholder="Select visibility..." />
                            <ComboboxContent>
                              <ComboboxEmpty>No options found.</ComboboxEmpty>
                              <ComboboxList>
                                {(item: SelectOption<PlanVisibility>) => (
                                  <ComboboxItem key={item.value} value={item}>
                                    {item.label}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                        )
                      }}
                    />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Sort order</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      min="0"
                      {...form.register("sort_order", {
                        valueAsNumber: true,
                      })}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Featured</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={form.control}
                      name="is_featured"
                      render={({ field }) => (
                        <div className="flex h-8 items-center gap-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="text-sm text-muted-foreground">
                            Highlight on pricing
                          </span>
                        </div>
                      )}
                    />
                  </FieldContent>
                </Field>
              </div>
            </FieldGroup>

            <PlansFeaturesFields
              control={form.control}
              disabled={isSubmitting}
            />
          </form>

          {isUpdate && currentRow ? (
            <PlansPricesManager planId={currentRow.id} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Save the plan first, then manage currency prices from the edit
              dialog.
            </p>
          )}
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button type="submit" form="plan-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {isUpdate ? "Save changes" : "Create plan"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
