"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import * as React from "react"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@/components/ui/button"
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
import {
    useCreateFeatureCategory,
    useUpdateFeatureCategory,
} from "@/features/central/billing/feature-categories/hooks/use-feature-category-query"
import {
    type StoreFeatureCategoryFormValues,
    storeFeatureCategorySchema,
    type UpdateFeatureCategoryFormValues,
} from "@/features/central/billing/feature-categories/schemas"
import {handleFormApiError} from "@/lib/form-api-errors"
import {toastApiSuccess} from "@/lib/toast-api"
import type {FeatureCategory} from "@/types/central/feature-category"

type FeatureCategoriesFormDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: FeatureCategory
}

const defaults: StoreFeatureCategoryFormValues = {
    name: "",
    slug: "",
    description: "",
    icon: "",
    sort_order: 0,
    is_active: true,
}

export function FeatureCategoriesFormDialog({
                                                open,
                                                onOpenChange,
                                                currentRow,
                                            }: FeatureCategoriesFormDialogProps) {
    const isUpdate = !!currentRow
    const createFeatureCategory = useCreateFeatureCategory()
    const updateFeatureCategory = useUpdateFeatureCategory()
    const isSubmitting =
        createFeatureCategory.isPending || updateFeatureCategory.isPending

    const form = useForm<StoreFeatureCategoryFormValues>({
        resolver: zodResolver(storeFeatureCategorySchema),
        defaultValues: defaults,
    })

    React.useEffect(() => {
        if (!open) {
            return
        }

        if (currentRow) {
            form.reset({
                name: currentRow.name,
                slug: currentRow.slug,
                description: currentRow.description || "",
                icon: currentRow.icon || "",
                sort_order: currentRow.sort_order ?? 0,
                is_active: currentRow.is_active,
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

    const onSubmit = (data: StoreFeatureCategoryFormValues) => {
        if (isUpdate && currentRow) {
            const values: UpdateFeatureCategoryFormValues = data
            updateFeatureCategory.mutate(
                {id: currentRow.id, values},
                {
                    onSuccess: (result) => {
                        toastApiSuccess(
                            result.message,
                            "Feature category updated successfully"
                        )
                        onOpenChange(false)
                    },
                    onError: (error) => {
                        handleFormApiError(
                            error,
                            form.setError,
                            "Failed to update feature category"
                        )
                    },
                }
            )
            return
        }

        createFeatureCategory.mutate(data, {
            onSuccess: (result) => {
                toastApiSuccess(
                    result.message,
                    "Feature category created successfully"
                )
                onOpenChange(false)
            },
            onError: (error) => {
                handleFormApiError(
                    error,
                    form.setError,
                    "Failed to create feature category"
                )
            },
        })
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {isUpdate ? "Edit feature category" : "Create feature category"}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {isUpdate
                            ? "Update this feature category."
                            : "Group related features together."}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <form
                    id="feature-category-form"
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <FieldContent>
                                <Input {...form.register("name")} placeholder="Integrations"/>
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
                                <Input {...form.register("slug")} placeholder="integrations"/>
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
                                    placeholder="Third-party integrations and connectors"
                                    rows={3}
                                />
                            </FieldContent>
                        </Field>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel>Icon</FieldLabel>
                                <FieldContent>
                                    <Input
                                        {...form.register("icon")}
                                        placeholder="plug"
                                    />
                                </FieldContent>
                            </Field>
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
                        </div>

                        <Field>
                            <FieldLabel>Active</FieldLabel>
                            <FieldContent>
                                <Controller
                                    control={form.control}
                                    name="is_active"
                                    render={({field}) => (
                                        <div className="flex h-8 items-center gap-2">
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <span className="text-muted-foreground text-sm">
                        Visible and selectable for features
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
                    <Button
                        type="submit"
                        form="feature-category-form"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Spinner/> : null}
                        {isUpdate ? "Save changes" : "Create category"}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
