"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import * as React from "react"
import {useForm} from "react-hook-form"

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
import {useCitiesContext} from "@/features/central/world/cities/components/cities-provider"
import {
    useCountrySelectOptions,
    useCreateCity,
    useDeleteCity,
    useStateSelectOptions,
    useUpdateCity,
} from "@/features/central/world/hooks/use-world-query"
import {type CityFormValues, citySchema,} from "@/features/central/world/schemas"
import {handleFormApiError} from "@/lib/form-api-errors"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"
import type {City, CountryOption} from "@/types/central/world"

const emptyValues: CityFormValues = {
    country_id: "",
    state_id: "",
    name: "",
    country_code: "",
    state_code: "",
}

type CityFormDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: City
}

function CityFormDialog({
                            open,
                            onOpenChange,
                            currentRow,
                        }: CityFormDialogProps) {
    const isUpdate = !!currentRow
    const createCity = useCreateCity()
    const updateCity = useUpdateCity()
    const isSubmitting = createCity.isPending || updateCity.isPending
    const {data: countryOptions = []} = useCountrySelectOptions()

    const form = useForm<CityFormValues>({
        resolver: zodResolver(citySchema),
        defaultValues: emptyValues,
    })

    const countryIdValue = form.watch("country_id")
    const stateIdValue = form.watch("state_id")

    const {data: stateOptions = []} = useStateSelectOptions(
        countryIdValue ? Number(countryIdValue) : undefined
    )

    React.useEffect(() => {
        if (!open) {
            return
        }

        if (currentRow) {
            form.reset({
                country_id: String(currentRow.country_id),
                state_id: String(currentRow.state_id),
                name: currentRow.name,
                country_code: currentRow.country_code || "",
                state_code: currentRow.state_code || "",
            })
        } else {
            form.reset(emptyValues)
        }
    }, [open, currentRow, form])

    const selectedCountry =
        countryOptions.find((option) => option.value === countryIdValue) ?? null
    const selectedState =
        stateOptions.find((option) => option.value === stateIdValue) ?? null

    const onSubmit = (data: CityFormValues) => {
        const handlers = {
            onSuccess: (result: { message?: string }) => {
                toastApiSuccess(
                    result.message,
                    isUpdate ? "City updated successfully" : "City created successfully"
                )
                onOpenChange(false)
            },
            onError: (error: unknown) => {
                handleFormApiError(
                    error,
                    form.setError,
                    isUpdate ? "Failed to update city" : "Failed to create city"
                )
            },
        }

        if (isUpdate && currentRow) {
            updateCity.mutate({id: currentRow.id, values: data}, handlers)
            return
        }

        createCity.mutate(data, handlers)
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {isUpdate ? "Edit city" : "Create city"}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {isUpdate
                            ? "Update reference data for this city."
                            : "Add a new city to a state and country."}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <form
                    id="city-form"
                    className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Country</FieldLabel>
                            <FieldContent>
                                <Combobox
                                    items={countryOptions}
                                    itemToStringValue={(item: CountryOption) => item.label}
                                    value={selectedCountry}
                                    onValueChange={(item: CountryOption | null) => {
                                        form.setValue("country_id", item?.value ?? "", {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        })
                                        form.setValue("state_id", "", {shouldDirty: true})
                                    }}
                                >
                                    <ComboboxInput placeholder="Select country..."/>
                                    <ComboboxContent>
                                        <ComboboxEmpty>No countries found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item: CountryOption) => (
                                                <ComboboxItem key={item.value} value={item}>
                                                    {item.label}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <FieldError
                                    errors={
                                        form.formState.errors.country_id
                                            ? [form.formState.errors.country_id]
                                            : []
                                    }
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>State</FieldLabel>
                            <FieldContent>
                                <Combobox
                                    items={stateOptions}
                                    itemToStringValue={(item: CountryOption) => item.label}
                                    value={selectedState}
                                    onValueChange={(item: CountryOption | null) => {
                                        form.setValue("state_id", item?.value ?? "", {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        })
                                    }}
                                >
                                    <ComboboxInput
                                        placeholder={
                                            countryIdValue
                                                ? "Select state..."
                                                : "Select a country first..."
                                        }
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>No states found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item: CountryOption) => (
                                                <ComboboxItem key={item.value} value={item}>
                                                    {item.label}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <FieldError
                                    errors={
                                        form.formState.errors.state_id
                                            ? [form.formState.errors.state_id]
                                            : []
                                    }
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <FieldContent>
                                <Input {...form.register("name")} placeholder="Ikeja"/>
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
                                <FieldLabel>Country code</FieldLabel>
                                <FieldContent>
                                    <Input
                                        {...form.register("country_code")}
                                        placeholder="NG"
                                        maxLength={3}
                                    />
                                    <FieldError
                                        errors={
                                            form.formState.errors.country_code
                                                ? [form.formState.errors.country_code]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>State code</FieldLabel>
                                <FieldContent>
                                    <Input
                                        {...form.register("state_code")}
                                        placeholder="LA"
                                        maxLength={5}
                                    />
                                    <FieldError
                                        errors={
                                            form.formState.errors.state_code
                                                ? [form.formState.errors.state_code]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>
                        </div>
                    </FieldGroup>
                </form>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button type="submit" form="city-form" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner/> : null}
                        {isUpdate ? "Save changes" : "Create city"}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

type CityViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    city: City
}

function CityViewDialog({open, onOpenChange, city}: CityViewDialogProps) {
    const rows = [
        ["Name", city.name],
        ["State", city.state?.name ?? String(city.state_id)],
        ["Country", city.country?.name ?? String(city.country_id)],
        ["Country code", city.country_code || "—"],
        ["State code", city.state_code || "—"],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>City details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {city.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="flex flex-col gap-3 text-sm">
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

export function CitiesDialogs() {
    const {open, setOpen, currentRow, setCurrentRow} = useCitiesContext()
    const deleteCity = useDeleteCity()

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

        deleteCity.mutate(currentRow.id, {
            onSuccess: (result) => {
                toastApiSuccess(
                    result.message,
                    `City "${currentRow.name}" deleted successfully`
                )
                handleClose()
            },
            onError: (error) => {
                toastApiError(error, "Failed to delete city")
            },
        })
    }

    return (
        <>
            <CityFormDialog
                open={open === "create"}
                onOpenChange={(val) => {
                    if (!val) {
                        setOpen(null)
                    }
                }}
            />

            {currentRow ? (
                <>
                    <CityFormDialog
                        key={`city-update-${currentRow.id}`}
                        open={open === "update"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        currentRow={currentRow}
                    />

                    <CityViewDialog
                        key={`city-view-${currentRow.id}`}
                        open={open === "view"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        city={currentRow}
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
                                <ResponsiveDialogTitle>Delete city</ResponsiveDialogTitle>
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
                                    disabled={deleteCity.isPending}
                                    onClick={runDelete}
                                >
                                    {deleteCity.isPending ? <Spinner/> : null}
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
