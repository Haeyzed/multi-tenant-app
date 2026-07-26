"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"

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
import {
  findSelectOption,
  type SelectOption,
} from "@/features/central/shared/select-option"
import {
  useCreateCountry,
  useUpdateCountry,
} from "@/features/central/world/hooks/use-world-query"
import {
  countryStatusOptions,
  type CountryStatusValue,
} from "@/features/central/world/options"
import {
  type CountryFormValues,
  countrySchema,
} from "@/features/central/world/schemas"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiSuccess } from "@/lib/toast-api"
import type { Country } from "@/features/central/world/types"

const emptyValues: CountryFormValues = {
  name: "",
  iso2: "",
  iso3: "",
  status: "1",
  phone_code: "",
  native: "",
  region: "",
  subregion: "",
  emoji: "",
}

type CountriesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Country
}

export function CountriesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: CountriesFormDialogProps) {
  const isUpdate = !!currentRow
  const createCountry = useCreateCountry()
  const updateCountry = useUpdateCountry()
  const isSubmitting = createCountry.isPending || updateCountry.isPending

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: emptyValues,
  })

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        iso2: currentRow.iso2,
        iso3: currentRow.iso3 || "",
        status: Number(currentRow.status ?? 1) === 1 ? "1" : "0",
        phone_code: currentRow.phone_code || "",
        native: currentRow.native || "",
        region: currentRow.region || "",
        subregion: currentRow.subregion || "",
        emoji: currentRow.emoji || "",
      })
    } else {
      form.reset(emptyValues)
    }
  }, [open, currentRow, form])

  const statusValue = form.watch("status")
  const selectedStatus = findSelectOption(countryStatusOptions, statusValue)

  const onSubmit = (data: CountryFormValues) => {
    const handlers = {
      onSuccess: (result: { message?: string }) => {
        toastApiSuccess(
          result.message,
          isUpdate
            ? "Country updated successfully"
            : "Country created successfully"
        )
        onOpenChange(false)
      },
      onError: (error: unknown) => {
        handleFormApiError(
          error,
          form.setError,
          isUpdate ? "Failed to update country" : "Failed to create country"
        )
      },
    }

    if (isUpdate && currentRow) {
      updateCountry.mutate({ id: currentRow.id, values: data }, handlers)
      return
    }

    createCountry.mutate(data, handlers)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit country" : "Create country"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update reference data for this country."
              : "Add a new country to the world reference data."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="country-form"
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input {...form.register("name")} placeholder="Nigeria" />
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
                <FieldLabel>ISO2</FieldLabel>
                <FieldContent>
                  <Input
                    {...form.register("iso2")}
                    placeholder="NG"
                    maxLength={2}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.iso2
                        ? [form.formState.errors.iso2]
                        : []
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>ISO3</FieldLabel>
                <FieldContent>
                  <Input
                    {...form.register("iso3")}
                    placeholder="NGA"
                    maxLength={3}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.iso3
                        ? [form.formState.errors.iso3]
                        : []
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <Combobox
                    items={countryStatusOptions}
                    itemToStringValue={(
                      item: SelectOption<CountryStatusValue>
                    ) => item.label}
                    value={selectedStatus}
                    onValueChange={(
                      item: SelectOption<CountryStatusValue> | null
                    ) => {
                      form.setValue("status", item?.value ?? "1", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }}
                  >
                    <ComboboxInput placeholder="Select status..." />
                    <ComboboxContent>
                      <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item: SelectOption<CountryStatusValue>) => (
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
                <FieldLabel>Phone code</FieldLabel>
                <FieldContent>
                  <Input
                    {...form.register("phone_code")}
                    placeholder="234"
                    maxLength={5}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.phone_code
                        ? [form.formState.errors.phone_code]
                        : []
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Region</FieldLabel>
                <FieldContent>
                  <Input {...form.register("region")} placeholder="Africa" />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Subregion</FieldLabel>
                <FieldContent>
                  <Input
                    {...form.register("subregion")}
                    placeholder="Western Africa"
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Native name</FieldLabel>
                <FieldContent>
                  <Input {...form.register("native")} placeholder="Nigeria" />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Emoji</FieldLabel>
                <FieldContent>
                  <Input {...form.register("emoji")} placeholder="🇳🇬" />
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button type="submit" form="country-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {isUpdate ? "Save changes" : "Create country"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
