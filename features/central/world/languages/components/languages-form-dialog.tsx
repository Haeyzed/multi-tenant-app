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
  useCreateLanguage,
  useUpdateLanguage,
} from "@/features/central/world/hooks/use-world-query"
import {
  type LanguageDirValue,
  languageDirOptions,
} from "@/features/central/world/options"
import {
  type LanguageFormValues,
  languageSchema,
} from "@/features/central/world/schemas"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiSuccess } from "@/lib/toast-api"
import type { Language } from "@/types/central/world"

const emptyValues: LanguageFormValues = {
  code: "",
  name: "",
  name_native: "",
  dir: "ltr",
}

type LanguagesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Language
}

export function LanguagesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: LanguagesFormDialogProps) {
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
  const selectedDir = findSelectOption(languageDirOptions, dirValue)

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
      updateLanguage.mutate({ id: currentRow.id, values: data }, handlers)
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
                    items={languageDirOptions}
                    itemToStringValue={(item: SelectOption<LanguageDirValue>) =>
                      item.label
                    }
                    value={selectedDir}
                    onValueChange={(
                      item: SelectOption<LanguageDirValue> | null
                    ) => {
                      form.setValue("dir", item?.value ?? "ltr", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }}
                  >
                    <ComboboxInput placeholder="Select direction..." />
                    <ComboboxContent>
                      <ComboboxEmpty>No directions found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item: SelectOption<LanguageDirValue>) => (
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
                <Input {...form.register("name")} placeholder="English" />
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
            {isSubmitting ? <Spinner /> : null}
            {isUpdate ? "Save changes" : "Create language"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
