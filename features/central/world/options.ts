import type { SelectOption } from "@/features/central/shared/select-option"

export type CountryStatusValue = "0" | "1"

export const countryStatusOptions: SelectOption<CountryStatusValue>[] = [
  { label: "Active", value: "1" },
  { label: "Inactive", value: "0" },
]

export type LanguageDirValue = "ltr" | "rtl"

export const languageDirOptions: SelectOption<LanguageDirValue>[] = [
  { label: "Left to right (LTR)", value: "ltr" },
  { label: "Right to left (RTL)", value: "rtl" },
]
