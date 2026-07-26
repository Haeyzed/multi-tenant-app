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
import { useGetFeatureCategoryOptions } from "@/features/central/billing/feature-categories/hooks/use-feature-category-query"
import {
  useCreateFeature,
  useUpdateFeature,
} from "@/features/central/billing/features/hooks/use-feature-query"
import {
  type StoreFeatureFormValues,
  storeFeatureSchema,
  type UpdateFeatureFormValues,
} from "@/features/central/billing/features/schemas"
import {
  featureLimitTypeOptions,
  featureStatusOptions,
} from "@/features/central/billing/features/options"
import {
  findSelectOption,
  type SelectOption,
} from "@/features/central/shared/select-option"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiSuccess } from "@/lib/toast-api"
import type {
  Feature,
  FeatureLimitType,
  FeatureStatus,
} from "@/features/central/billing/features/types"

type FeaturesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Feature
}

const defaults: StoreFeatureFormValues = {
  feature_category_id: null,
  name: "",
  slug: "",
  key: "",
  description: "",
  status: "active",
  default_limit_type: "boolean",
  default_limit_value: null,
  unit: "",
  is_available: true,
  tracks_usage: false,
  sort_order: 0,
}

export function FeaturesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: FeaturesFormDialogProps) {
  const isUpdate = !!currentRow
  const createFeature = useCreateFeature()
  const updateFeature = useUpdateFeature()
  const { data: categoryOptions = [] } = useGetFeatureCategoryOptions(open)
  const isSubmitting = createFeature.isPending || updateFeature.isPending

  const form = useForm<StoreFeatureFormValues>({
    resolver: zodResolver(storeFeatureSchema),
    defaultValues: defaults,
  })

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (currentRow) {
      form.reset({
        feature_category_id: currentRow.feature_category_id ?? null,
        name: currentRow.name,
        slug: currentRow.slug,
        key: currentRow.key,
        description: currentRow.description || "",
        status: currentRow.status,
        default_limit_type: currentRow.default_limit_type || "boolean",
        default_limit_value: currentRow.default_limit_value ?? null,
        unit: currentRow.unit || "",
        is_available: currentRow.is_available,
        tracks_usage: currentRow.tracks_usage,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset(defaults)
    }
  }, [open, currentRow, form])

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

  const onSubmit = (data: StoreFeatureFormValues) => {
    if (isUpdate && currentRow) {
      const values: UpdateFeatureFormValues = data
      updateFeature.mutate(
        { id: currentRow.id, values },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Feature updated successfully")
            onOpenChange(false)
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update feature")
          },
        }
      )
      return
    }

    createFeature.mutate(data, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "Feature created successfully")
        onOpenChange(false)
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Failed to create feature")
      },
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit feature" : "Create feature"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update this billable feature definition."
              : "Define a feature that can be assigned to plans."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="feature-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input
                  {...form.register("name")}
                  placeholder="Advanced Analytics"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Slug</FieldLabel>
                <FieldContent>
                  <Input
                    {...form.register("slug")}
                    placeholder="advanced-analytics"
                  />
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
                <FieldLabel>Key</FieldLabel>
                <FieldContent>
                  <Input
                    {...form.register("key")}
                    placeholder="analytics.advanced"
                  />
                  <FieldError
                    errors={
                      form.formState.errors.key
                        ? [form.formState.errors.key]
                        : []
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  {...form.register("description")}
                  placeholder="Unlock cohort and funnel reporting."
                  rows={3}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="feature_category_id"
                  render={({ field }) => {
                    const selected =
                      categoryOptions.find(
                        (option) => option.value === field.value
                      ) ?? null
                    return (
                      <Combobox
                        items={categoryOptions}
                        itemToStringValue={(item: SelectOption<number>) => item.label}
                        value={selected}
                        onValueChange={(item: SelectOption<number> | null) =>
                          field.onChange(item?.value ?? null)
                        }
                      >
                        <ComboboxInput
                          placeholder="Select category..."
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No categories found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: SelectOption<number>) => (
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => {
                      const selected =
                        featureStatusOptions.find(
                          (option) => option.value === field.value
                        ) ?? null
                      return (
                        <Combobox
                          items={featureStatusOptions}
                          itemToStringValue={(item: SelectOption<FeatureStatus>) =>
                            item.label
                          }
                          value={selected}
                          onValueChange={(item: SelectOption<FeatureStatus> | null) =>
                            field.onChange(item?.value ?? "active")
                          }
                        >
                          <ComboboxInput placeholder="Select status..." />
                          <ComboboxContent>
                            <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item: SelectOption<FeatureStatus>) => (
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
                <FieldLabel>Default limit type</FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="default_limit_type"
                    render={({ field }) => {
                      const selected =
                        featureLimitTypeOptions.find(
                          (option) => option.value === field.value
                        ) ?? null
                      return (
                        <Combobox
                          items={featureLimitTypeOptions}
                          itemToStringValue={(item: SelectOption<FeatureLimitType>) =>
                            item.label
                          }
                          value={selected}
                          onValueChange={(
                            item: SelectOption<FeatureLimitType> | null
                          ) => field.onChange(item?.value ?? "boolean")}
                        >
                          <ComboboxInput placeholder="Select limit type..." />
                          <ComboboxContent>
                            <ComboboxEmpty>No limit types found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item: SelectOption<FeatureLimitType>) => (
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
                <FieldLabel>Default limit value</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min="0"
                    {...form.register("default_limit_value", {
                      setValueAs: (value) => {
                        if (
                          value === "" ||
                          value === null ||
                          value === undefined
                        ) {
                          return null
                        }
                        const parsed = Number(value)
                        return Number.isNaN(parsed) ? null : parsed
                      },
                    })}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Unit</FieldLabel>
                <FieldContent>
                  <Input {...form.register("unit")} placeholder="reports" />
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
                <FieldLabel>Available</FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="is_available"
                    render={({ field }) => (
                      <div className="flex h-8 items-center gap-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          Can be assigned to plans
                        </span>
                      </div>
                    )}
                  />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Track usage</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="tracks_usage"
                  render={({ field }) => (
                    <div className="flex h-8 items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm text-muted-foreground">
                        Meter usage for this feature
                      </span>
                    </div>
                  )}
                />
              </FieldContent>
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button type="submit" form="feature-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {isUpdate ? "Save changes" : "Create feature"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
