import type { SelectOption } from "@/features/central/shared/select-option"
import type { UserStatus } from "@/types/central/user"

export const userStatusOptions: SelectOption<UserStatus>[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
]
