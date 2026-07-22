"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import * as React from "react"
import {useForm} from "react-hook-form"

import {Badge} from "@/components/ui/badge"
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
import {useCreateLanguage, useDeleteLanguage, useUpdateLanguage,} from "@/features/central/world/hooks/use-world-query"
import {useLanguagesContext} from "@/features/central/world/languages/components/languages-provider"
import {type LanguageFormValues, languageSchema,} from "@/features/central/world/schemas"
import {handleFormApiError} from "@/lib/form-api-errors"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"
import type {Language} from "@/types/central/world"

type DirOption = { label: string; value: "ltr" | "rtl" }

const dirOptions: DirOption[] = [
    {label: "Left to right (LTR)", value: "ltr"},
    {label: "Right to left (RTL)", value: "rtl"},
]

const emptyValues: LanguageFormValues = {
    code: "",
    name: "",
    name_native: "",
    dir: "ltr",
}

type LanguageFormDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Language
}

function LanguageFormDialog({
                                open,
                                onOpenChange,
                                currentRow,
                            }: LanguageFormDialogProps) {
    const isUpdate = !!currentRow
    const createLanguage = useCreateLanguage()
    const updateLanguage = useUpdateLanguage()
    const isSubmitting = createLanguage.isPending || updateLanguage.isPending

    const form = useForm<LanguageFormValues>({
        resolver: zodResolver(languageSchema),
        defaultValues: emptyValues,
    })

    React.useEffect(() => {
        if (!open) {
            return
        }

        if (currentRow) {
            form.reset({
                code: currentRow.code,
                name: currentRow.name,
                name_native: currentRow.name_native || "",
                dir: currentRow.dir === "rtl" ? "rtl" : "ltr",
            })
        } else {
            form.reset(emptyValues)
        }
    }, [open, currentRow, form])

    const dirValue = form.watch("dir")
    const selectedDir =
        dirOptions.find((option) => option.value === dirValue) ?? null

    const onSubmit = (data: LanguageFormValues) => {
        const handlers = {
            onSuccess: (result: { message?: string }) => {
                toastApiSuccess(
                    result.message,
                    isUpdate
                        ? "Language updated successfully"
                        : "Language created successfully"
                )
                onOpenChange(false)
            },
            onError: (error: unknown) => {
                handleFormApiError(
                    error,
                    form.setError,
                    isUpdate ? "Failed to update language" : "Failed to create language"
                )
            },
        }

        if (isUpdate && currentRow) {
            updateLanguage.mutate({id: currentRow.id, values: data}, handlers)
            return
        }

        createLanguage.mutate(data, handlers)
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {isUpdate ? "Edit language" : "Create language"}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {isUpdate
                            ? "Update reference data for this language."
                            : "Add a new locale language."}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <form
                    id="language-form"
                    className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel>Code</FieldLabel>
                                <FieldContent>
                                    <Input
                                        {...form.register("code")}
                                        placeholder="en"
                                        maxLength={2}
                                    />
                                    <FieldError
                                        errors={
                                            form.formState.errors.code
                                                ? [form.formState.errors.code]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Direction</FieldLabel>
                                <FieldContent>
                                    <Combobox
                                        items={dirOptions}
                                        itemToStringValue={(item: DirOption) => item.label}
                                        value={selectedDir}
                                        onValueChange={(item: DirOption | null) => {
                                            form.setValue("dir", item?.value ?? "ltr", {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            })
                                        }}
                                    >
                                        <ComboboxInput placeholder="Select direction..."/>
                                        <ComboboxContent>
                                            <ComboboxEmpty>No directions found.</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item: DirOption) => (
                                                    <ComboboxItem key={item.value} value={item}>
                                                        {item.label}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    <FieldError
                                        errors={
                                            form.formState.errors.dir
                                                ? [form.formState.errors.dir]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <FieldContent>
                                <Input {...form.register("name")} placeholder="English"/>
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
                            <FieldLabel>Native name</FieldLabel>
                            <FieldContent>
                                <Input
                                    {...form.register("name_native")}
                                    placeholder="English"
                                />
                                <FieldError
                                    errors={
                                        form.formState.errors.name_native
                                            ? [form.formState.errors.name_native]
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
                    <Button type="submit" form="language-form" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner/> : null}
                        {isUpdate ? "Save changes" : "Create language"}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

type LanguageViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    language: Language
}

function LanguageViewDialog({
                                open,
                                onOpenChange,
                                language,
                            }: LanguageViewDialogProps) {
    const rows = [
        ["Name", language.name],
        ["Native name", language.name_native || "—"],
        ["Code", language.code],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Language details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {language.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Direction</span>
                        <Badge variant="outline" className="uppercase">
                            {language.dir || "ltr"}
                        </Badge>
                    </div>
                    {rows.map(([label, value]) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                        >
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-end font-medium">{value}</span>
                        </div>
                    ))}
                </div>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Close</Button>}
                    />
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export function LanguagesDialogs() {
    const {open, setOpen, currentRow, setCurrentRow} = useLanguagesContext()
    const deleteLanguage = useDeleteLanguage()

    const handleClose = React.useCallback(() => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
        }, 300)
    }, [setOpen, setCurrentRow])

    const runDelete = () => {
        if (!currentRow) {
            return
        }

        deleteLanguage.mutate(currentRow.id, {
            onSuccess: (result) => {
                toastApiSuccess(
                    result.message,
                    `Language "${currentRow.name}" deleted successfully`
                )
                handleClose()
            },
            onError: (error) => {
                toastApiError(error, "Failed to delete language")
            },
        })
    }

    return (
        <>
            <LanguageFormDialog
                open={open === "create"}
                onOpenChange={(val) => {
                    if (!val) {
                        setOpen(null)
                    }
                }}
            />

            {currentRow ? (
                <>
                    <LanguageFormDialog
                        key={`language-update-${currentRow.id}`}
                        open={open === "update"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        currentRow={currentRow}
                    />

                    <LanguageViewDialog
                        key={`language-view-${currentRow.id}`}
                        open={open === "view"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        language={currentRow}
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
                                <ResponsiveDialogTitle>Delete language</ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Delete <strong>{currentRow.name}</strong>? This cannot be
                                    undone.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>
                            <ResponsiveDialogFooter>
                                <ResponsiveDialogClose
                                    render={<Button variant="outline">Cancel</Button>}
                                />
                                <Button
                                    variant="destructive"
                                    disabled={deleteLanguage.isPending}
                                    onClick={runDelete}
                                >
                                    {deleteLanguage.isPending ? <Spinner/> : null}
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
