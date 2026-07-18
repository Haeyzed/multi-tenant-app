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
  useCreateState,
  useDeleteState,
  useUpdateState,
} from "@/features/central/world/hooks/use-world-query"
import {
  type StateFormValues,
  stateSchema,
} from "@/features/central/world/schemas"
import { useStatesContext } from "@/features/central/world/states/components/states-provider"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { CountryOption, State } from "@/types/central/world"

const emptyValues: StateFormValues = {
  country_id: "",
  name: "",
  state_code: "",
  country_code: "",
  type: "",
}

type StateFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: State
}

function StateFormDialog({
  open,
  onOpenChange,
  currentRow,
}: StateFormDialogProps) {
  const isUpdate = !!currentRow
  const createState = useCreateState()
  const updateState = useUpdateState()
  const isSubmitting = createState.isPending || updateState.isPending
  const { data: countryOptions = [] } = useCountrySelectOptions()

  const form = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: emptyValues,
  })

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (currentRow) {
      form.reset({
        country_id: String(currentRow.country_id),
        name: currentRow.name,
        state_code: currentRow.state_code || "",
        country_code: currentRow.country_code || "",
        type: currentRow.type || "",
      })
    } else {
      form.reset(emptyValues)
    }
  }, [open, currentRow, form])

  const countryIdValue = form.watch("country_id")
  const selectedCountry =
    countryOptions.find((option) => option.value === countryIdValue) ?? null

  const onSubmit = (data: StateFormValues) => {
    const handlers = {
      onSuccess: (result: { message?: string }) => {
        toastApiSuccess(
          result.message,
          isUpdate ? "State updated successfully" : "State created successfully"
        )
        onOpenChange(false)
      },
      onError: (error: unknown) => {
        handleFormApiError(
          error,
          form.setError,
          isUpdate ? "Failed to update state" : "Failed to create state"
        )
      },
    }

    if (isUpdate && currentRow) {
      updateState.mutate({ id: currentRow.id, values: data }, handlers)
      return
    }

    createState.mutate(data, handlers)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit state" : "Create state"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update reference data for this state."
              : "Add a new state or province to a country."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="state-form"
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
                <Input {...form.register("name")} placeholder="Lagos" />
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
            </div>

            <Field>
              <FieldLabel>Type</FieldLabel>
              <FieldContent>
                <Input {...form.register("type")} placeholder="province" />
              </FieldContent>
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button type="submit" form="state-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            {isUpdate ? "Save changes" : "Create state"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

type StateViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  state: State
}

function StateViewDialog({ open, onOpenChange, state }: StateViewDialogProps) {
  const rows = [
    ["Name", state.name],
    ["State code", state.state_code || "—"],
    ["Country", state.country?.name ?? String(state.country_id)],
    ["Country code", state.country_code || "—"],
    ["Type", state.type || "—"],
  ] as const

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>State details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Read-only overview for {state.name}.
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

export function StatesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStatesContext()
  const deleteState = useDeleteState()

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

    deleteState.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `State "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete state")
      },
    })
  }

  return (
    <>
      <StateFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <StateFormDialog
            key={`state-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <StateViewDialog
            key={`state-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            state={currentRow}
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
                <ResponsiveDialogTitle>Delete state</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Delete <strong>{currentRow.name}</strong>? Related cities may
                  be affected.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  disabled={deleteState.isPending}
                  onClick={runDelete}
                >
                  {deleteState.isPending ? <Spinner /> : null}
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
