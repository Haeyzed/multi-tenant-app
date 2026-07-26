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
  useCreateCurrency,
  useUpdateCurrency,
} from "@/features/central/world/hooks/use-world-query"
import {
  type CurrencyFormValues,
  currencySchema,
} from "@/features/central/world/schemas"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiSuccess } from "@/lib/toast-api"
import type { CountryOption, Currency } from "@/types/central/world"

const emptyValues: CurrencyFormValues = {
  country_id: "",
  name: "",
  code: "",
  symbol: "",
  symbol_native: "",
  precision: "",
}

type CurrenciesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Currency
}

export function CurrenciesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: CurrenciesFormDialogProps) {
  const isUpdate = !!currentRow
  const createCurrency = useCreateCurrency()
  const updateCurrency = useUpdateCurrency()
  const isSubmitting = createCurrency.isPending || updateCurrency.isPending
  const { data: countryOptions = [] } = useCountrySelectOptions()

  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
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
        code: currentRow.code,
        symbol: currentRow.symbol || "",
        symbol_native: currentRow.symbol_native || "",
        precision:
          currentRow.precision !== null && currentRow.precision !== undefined
            ? String(currentRow.precision)
            : "",
      })
    } else {
      form.reset(emptyValues)
    }
  }, [open, currentRow, form])

  const countryIdValue = form.watch("country_id")
  const selectedCountry =
    countryOptions.find((option) => option.value === countryIdValue) ?? null

  const onSubmit = (data: CurrencyFormValues) => {
    const handlers = {
      onSuccess: (result: { message?: string }) => {
        toastApiSuccess(
          result.message,
          isUpdate
            ? "Currency updated successfully"
            : "Currency created successfully"
        )
        onOpenChange(false)
      },
      onError: (error: unknown) => {
        handleFormApiError(
          error,
          form.setError,
          isUpdate ? "Failed to update currency" : "Failed to create currency"
        )
      },
    }

    if (isUpdate && currentRow) {
      updateCurrency.mutate({ id: currentRow.id, values: data }, handlers)
      return
    }

    createCurrency.mutate(data, handlers)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit currency" : "Create currency"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update reference data for this currency."
              : "Add a new currency to a country."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="currency-form"
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
                  placeholder="Nigerian naira"
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
                <FieldLabel>Code</FieldLabel>
                <FieldContent>
                  <Input {...form.register("code")} placeholder="NGN" />
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
                <FieldLabel>Precision</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={0}
                    max={8}
                    {...form.register("precision")}
                    placeholder="2"
                  />
                  <FieldError
                    errors={
                      form.formState.errors.precision
                        ? [form.formState.errors.precision]
                        : []
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Symbol</FieldLabel>
                <FieldContent>
                  <Input {...form.register("symbol")} placeholder="₦" />
                  <FieldError
                    errors={
                      form.formState.errors.symbol
                        ? [form.formState.errors.symbol]
                        : []
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Native symbol</FieldLabel>
                <FieldContent>
                  <Input {...form.register("symbol_native")} placeholder="₦" />
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button type="submit" form="currency-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {isUpdate ? "Save changes" : "Create currency"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
