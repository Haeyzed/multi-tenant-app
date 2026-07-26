/**
 * Shared select/combobox option shape used across central forms.
 */
export type SelectOption<T extends string | number = string> = {
  label: string
  value: T
}

export function findSelectOption<T extends string | number>(
  options: SelectOption<T>[],
  value: T | null | undefined
): SelectOption<T> | null {
  if (value === null || value === undefined) {
    return null
  }

  return options.find((option) => option.value === value) ?? null
}
