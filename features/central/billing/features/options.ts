import type { SelectOption } from "@/features/central/shared/select-option"
import type { FeatureLimitType, FeatureStatus } from "@/types/central/feature"

export const featureStatusOptions: SelectOption<FeatureStatus>[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Deprecated", value: "deprecated" },
]

export const featureLimitTypeOptions: SelectOption<FeatureLimitType>[] = [
  { label: "Unlimited", value: "unlimited" },
  { label: "Count Limit", value: "count" },
  { label: "Storage Limit", value: "storage" },
  { label: "Bandwidth Limit", value: "bandwidth" },
  { label: "Periodic Limit", value: "periodic" },
  { label: "Enabled/Disabled", value: "boolean" },
]

/** Compact labels for plan feature assignment fields. */
export const planFeatureLimitTypeOptions: SelectOption<FeatureLimitType>[] = [
  { label: "Boolean", value: "boolean" },
  { label: "Count", value: "count" },
  { label: "Storage", value: "storage" },
  { label: "Bandwidth", value: "bandwidth" },
  { label: "Periodic", value: "periodic" },
  { label: "Unlimited", value: "unlimited" },
]
