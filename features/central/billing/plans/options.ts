import type { SelectOption } from "@/features/central/shared/select-option"
import type {
  BillingInterval,
  PlanPriceInterval,
  PlanStatus,
  PlanVisibility,
} from "@/types/central/plan"

export const planStatusOptions: SelectOption<PlanStatus>[] = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
]

export const planVisibilityOptions: SelectOption<PlanVisibility>[] = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Hidden", value: "hidden" },
]

export const planBillingIntervalOptions: SelectOption<BillingInterval>[] = [
  { label: "Free", value: "free" },
  { label: "Trial", value: "trial" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
  { label: "Lifetime", value: "lifetime" },
  { label: "Enterprise", value: "enterprise" },
]

export const planPriceIntervalOptions: SelectOption<PlanPriceInterval>[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
]

export const planPriceStatusOptions: SelectOption<PlanStatus>[] = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
]
