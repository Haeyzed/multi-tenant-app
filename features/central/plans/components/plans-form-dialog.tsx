"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import * as React from "react"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@/components/ui/button"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import {Field, FieldContent, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {
    ResponsiveDialog,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {Spinner} from "@/components/ui/spinner"
import {Switch} from "@/components/ui/switch"
import {Textarea} from "@/components/ui/textarea"
import {useCreatePlan, useUpdatePlan,} from "@/features/central/plans/hooks/use-plan-query"
import {PlansPricesManager} from "@/features/central/plans/components/plans-prices-manager"
import {useBillingDefaultInterval} from "@/features/central/settings/hooks/use-setting-query"
import {type StorePlanFormValues, storePlanSchema, type UpdatePlanFormValues,} from "@/features/central/plans/schemas"
import {useCurrencyOptions} from "@/features/central/world/hooks/use-world-query"
import {handleFormApiError} from "@/lib/form-api-errors"
import {toastApiSuccess} from "@/lib/toast-api"
import type {BillingInterval, Plan, PlanStatus, PlanVisibility,} from "@/types/central/plan"
import type {CurrencyOption} from "@/types/central/world"

type PlansFormDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Plan
}

type Option<T extends string> = { label: string; value: T }

const statusOptions: Option<PlanStatus>[] = [
    {label: "Draft", value: "draft"},
    {label: "Active", value: "active"},
    {label: "Inactive", value: "inactive"},
    {label: "Archived", value: "archived"},
]

const visibilityOptions: Option<PlanVisibility>[] = [
    {label: "Public", value: "public"},
    {label: "Private", value: "private"},
    {label: "Hidden", value: "hidden"},
]

const intervalOptions: Option<BillingInterval>[] = [
    {label: "Free", value: "free"},
    {label: "Trial", value: "trial"},
    {label: "Monthly", value: "monthly"},
    {label: "Quarterly", value: "quarterly"},
    {label: "Yearly", value: "yearly"},
    {label: "Lifetime", value: "lifetime"},
    {label: "Enterprise", value: "enterprise"},
]

const defaults: StorePlanFormValues = {
    name: "",
    slug: "",
    description: "",
    price: 0,
    currency: "NGN",
    billing_interval: "monthly",
    trial_days: 14,
    status: "active",
    visibility: "public",
    is_featured: false,
    sort_order: 0,
}

export function PlansFormDialog({
                                    open,
                                    onOpenChange,
                                    currentRow,
                                }: PlansFormDialogProps) {
    const isUpdate = !!currentRow
    const createPlan = useCreatePlan()
    const updatePlan = useUpdatePlan()
    const isSubmitting = createPlan.isPending || updatePlan.isPending
    const {data: currencyOptions = []} = useCurrencyOptions()
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

        const dialogIdentity = currentRow ? `edit:${currentRow.id}` : "new"
        if (initializedDialogRef.current === dialogIdentity) {
            return
        }
        initializedDialogRef.current = dialogIdentity

        if (currentRow) {
            form.reset({
                name: currentRow.name,
                slug: currentRow.slug,
                description: currentRow.description || "",
                price: Number(currentRow.price),
                currency: currentRow.currency || "NGN",
                billing_interval:
                    currentRow.billing_interval || defaultBillingInterval,
                trial_days: currentRow.trial_days ?? 0,
                status: currentRow.status,
                visibility: currentRow.visibility,
                is_featured: currentRow.is_featured,
                sort_order: currentRow.sort_order ?? 0,
            })
        } else {
            form.reset({
                ...defaults,
                billing_interval: defaultBillingInterval,
            })
        }
    }, [open, currentRow, defaultBillingInterval, form])

    React.useEffect(() => {
        if (open && !currentRow && !form.formState.isDirty) {
            form.setValue("billing_interval", defaultBillingInterval)
        }
    }, [
        open,
        currentRow,
        defaultBillingInterval,
        form,
        form.formState.isDirty,
    ])

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
                {id: currentRow.id, values},
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
                            ? "Update pricing and visibility for this plan."
                            : "Define a billing plan tenants can subscribe to."}
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
                                    <Input {...form.register("name")} placeholder="Growth"/>
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
                                    <Input {...form.register("slug")} placeholder="growth"/>
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
                                    <FieldLabel>Price</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...form.register("price")}
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.price
                                                    ? [form.formState.errors.price]
                                                    : []
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Currency</FieldLabel>
                                    <FieldContent>
                                        <Controller
                                            control={form.control}
                                            name="currency"
                                            render={({field}) => {
                                                const selected =
                                                    currencyOptions.find(
                                                        (option) => option.value === field.value
                                                    ) ??
                                                    (field.value
                                                        ? {value: field.value, label: field.value}
                                                        : null)
                                                return (
                                                    <Combobox
                                                        items={currencyOptions}
                                                        itemToStringValue={(item: CurrencyOption) =>
                                                            item.label
                                                        }
                                                        value={selected}
                                                        onValueChange={(item: CurrencyOption | null) =>
                                                            field.onChange(item?.value ?? "")
                                                        }
                                                    >
                                                        <ComboboxInput placeholder="Select currency..."/>
                                                        <ComboboxContent>
                                                            <ComboboxEmpty>No currencies found.</ComboboxEmpty>
                                                            <ComboboxList>
                                                                {(item: CurrencyOption) => (
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
                                        <FieldError
                                            errors={
                                                form.formState.errors.currency
                                                    ? [form.formState.errors.currency]
                                                    : []
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel>Billing interval</FieldLabel>
                                    <FieldContent>
                                        <Controller
                                            control={form.control}
                                            name="billing_interval"
                                            render={({field}) => {
                                                const selected =
                                                    intervalOptions.find(
                                                        (option) => option.value === field.value
                                                    ) ?? null
                                                return (
                                                    <Combobox
                                                        items={intervalOptions}
                                                        itemToStringValue={(item: Option<BillingInterval>) =>
                                                            item.label
                                                        }
                                                        value={selected}
                                                        onValueChange={(
                                                            item: Option<BillingInterval> | null
                                                        ) =>
                                                            field.onChange(
                                                                item?.value ?? defaultBillingInterval
                                                            )}
                                                    >
                                                        <ComboboxInput placeholder="Select interval..."/>
                                                        <ComboboxContent>
                                                            <ComboboxEmpty>No intervals found.</ComboboxEmpty>
                                                            <ComboboxList>
                                                                {(item: Option<BillingInterval>) => (
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
                                            {...form.register("trial_days")}
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
                                            render={({field}) => {
                                                const selected =
                                                    statusOptions.find(
                                                        (option) => option.value === field.value
                                                    ) ?? null
                                                return (
                                                    <Combobox
                                                        items={statusOptions}
                                                        itemToStringValue={(item: Option<PlanStatus>) =>
                                                            item.label
                                                        }
                                                        value={selected}
                                                        onValueChange={(item: Option<PlanStatus> | null) =>
                                                            field.onChange(item?.value ?? "active")
                                                        }
                                                    >
                                                        <ComboboxInput placeholder="Select status..."/>
                                                        <ComboboxContent>
                                                            <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                                                            <ComboboxList>
                                                                {(item: Option<PlanStatus>) => (
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
                                            render={({field}) => {
                                                const selected =
                                                    visibilityOptions.find(
                                                        (option) => option.value === field.value
                                                    ) ?? null
                                                return (
                                                    <Combobox
                                                        items={visibilityOptions}
                                                        itemToStringValue={(item: Option<PlanVisibility>) =>
                                                            item.label
                                                        }
                                                        value={selected}
                                                        onValueChange={(
                                                            item: Option<PlanVisibility> | null
                                                        ) => field.onChange(item?.value ?? "public")}
                                                    >
                                                        <ComboboxInput placeholder="Select visibility..."/>
                                                        <ComboboxContent>
                                                            <ComboboxEmpty>No options found.</ComboboxEmpty>
                                                            <ComboboxList>
                                                                {(item: Option<PlanVisibility>) => (
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
                                            {...form.register("sort_order")}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Featured</FieldLabel>
                                    <FieldContent>
                                        <Controller
                                            control={form.control}
                                            name="is_featured"
                                            render={({field}) => (
                                                <div className="flex h-8 items-center gap-2">
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                    <span className="text-muted-foreground text-sm">
                          Highlight on pricing
                        </span>
                                                </div>
                                            )}
                                        />
                                    </FieldContent>
                                </Field>
                            </div>
                        </FieldGroup>
                    </form>

                    {isUpdate && currentRow ? (
                        <PlansPricesManager planId={currentRow.id}/>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Save the plan first, then manage additional currency prices from
                            the edit dialog.
                        </p>
                    )}
                </div>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button type="submit" form="plan-form" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner/> : null}
                        {isUpdate ? "Save changes" : "Create plan"}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
