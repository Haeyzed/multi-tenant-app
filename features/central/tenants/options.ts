import type { SelectOption } from "@/features/central/shared/select-option"
import type { TenantStatus } from "@/features/central/tenants/types"

export const tenantCreateStatusOptions: SelectOption<TenantStatus>[] = [
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Trial", value: "trial" },
]
