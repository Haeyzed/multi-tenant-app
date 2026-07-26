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
  useCountrySelectOptions,
  useCreateTimezone,
  useUpdateTimezone,
} from "@/features/central/world/hooks/use-world-query"
import {
  type TimezoneFormValues,
  timezoneSchema,
} from "@/features/central/world/schemas"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiSuccess } from "@/lib/toast-api"
import type { CountryOption, Timezone } from "@/features/central/world/types"

const emptyValues: TimezoneFormValues = {
  country_id: "",
  name: "",
}

type TimezonesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Timezone
}

export function TimezonesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: TimezonesFormDialogProps) {
  const isUpdate = !!currentRow
  const createTimezone = useCreateTimezone()
  const updateTimezone = useUpdateTimezone()
  const isSubmitting = createTimezone.isPending || updateTimezone.isPending
  const { data: countryOptions = [] } = useCountrySelectOptions()

  const form = useForm<TimezoneFormValues>({
    resolver: zodResolver(timezoneSchema),
    defaultValues: emptyValues,
  })

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (currentRow) {
      form.reset({
        country_id: currentRow.country_id ? String(currentRow.country_id) : "",
        name: currentRow.name,
      })
    } else {
      form.reset(emptyValues)
    }
  }, [open, currentRow, form])

  const countryIdValue = form.watch("country_id")
  const selectedCountry =
    countryOptions.find((option) => option.value === countryIdValue) ?? null

  const onSubmit = (data: TimezoneFormValues) => {
    const handlers = {
      onSuccess: (result: { message?: string }) => {
        toastApiSuccess(
          result.message,
          isUpdate
            ? "Timezone updated successfully"
            : "Timezone created successfully"
        )
        onOpenChange(false)
      },
      onError: (error: unknown) => {
        handleFormApiError(
          error,
          form.setError,
          isUpdate ? "Failed to update timezone" : "Failed to create timezone"
        )
      },
    }

    if (isUpdate && currentRow) {
      updateTimezone.mutate({ id: currentRow.id, values: data }, handlers)
      return
    }

    createTimezone.mutate(data, handlers)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit timezone" : "Create timezone"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update reference data for this timezone."
              : "Add a new timezone to a country."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="timezone-form"
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
                  }}
                >
                  <ComboboxInput placeholder="Select country..." />
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
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input
                  {...form.register("name")}
                  placeholder="Africa/Lagos"
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
          <Button type="submit" form="timezone-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {isUpdate ? "Save changes" : "Create timezone"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
