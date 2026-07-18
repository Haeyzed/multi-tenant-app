"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
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
import { useCountriesContext } from "@/features/central/world/countries/components/countries-provider"
import {
  useCreateCountry,
  useDeleteCountry,
  useUpdateCountry,
} from "@/features/central/world/hooks/use-world-query"
import {
  type CountryFormValues,
  countrySchema,
} from "@/features/central/world/schemas"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { Country } from "@/types/central/world"

type StatusOption = { label: string; value: "0" | "1" }

const statusOptions: StatusOption[] = [
  { label: "Active", value: "1" },
  { label: "Inactive", value: "0" },
]

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

type CountryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Country
}

function CountryFormDialog({
  open,
  onOpenChange,
  currentRow,
}: CountryFormDialogProps) {
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
  const selectedStatus =
    statusOptions.find((option) => option.value === statusValue) ?? null

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
                    items={statusOptions}
                    itemToStringValue={(item: StatusOption) => item.label}
                    value={selectedStatus}
                    onValueChange={(item: StatusOption | null) => {
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
                        {(item: StatusOption) => (
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

type CountryViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  country: Country
}

function CountryViewDialog({
  open,
  onOpenChange,
  country,
}: CountryViewDialogProps) {
  const rows = [
    ["Name", country.name],
    ["Native", country.native || "—"],
    ["ISO2", country.iso2],
    ["ISO3", country.iso3 || "—"],
    ["Phone code", country.phone_code ? `+${country.phone_code}` : "—"],
    ["Region", country.region || "—"],
    ["Subregion", country.subregion || "—"],
    ["Currency", country.currency_code || "—"],
    ["Emoji", country.emoji || "—"],
  ] as const

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Country details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Read-only overview for {country.name}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Status</span>
            <Badge>
              {Number(country.status ?? 1) === 1 ? "Active" : "Inactive"}
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

export function CountriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCountriesContext()
  const deleteCountry = useDeleteCountry()

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

    deleteCountry.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Country "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete country")
      },
    })
  }

  return (
    <>
      <CountryFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <CountryFormDialog
            key={`country-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <CountryViewDialog
            key={`country-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            country={currentRow}
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
                <ResponsiveDialogTitle>Delete country</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Delete <strong>{currentRow.name}</strong>? Related states,
                  cities, and lookups may be affected.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  disabled={deleteCountry.isPending}
                  onClick={runDelete}
                >
                  {deleteCountry.isPending ? <Spinner /> : null}
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
