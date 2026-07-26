"use client"

import { Controller, type Control, useWatch } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { useGetFeatures } from "@/features/central/billing/features/hooks/use-feature-query"
import type {
  PlanFeatureAssignmentFormValues,
  StorePlanFormValues,
} from "@/features/central/billing/plans/schemas"
import { planFeatureLimitTypeOptions } from "@/features/central/billing/features/options"
import type { FeatureLimitType } from "@/types/central/plan"

type PlansFeaturesFieldsProps = {
  control: Control<StorePlanFormValues>
  disabled?: boolean
}

function assignmentForFeature(
  features: PlanFeatureAssignmentFormValues[] | undefined,
  featureId: number
): PlanFeatureAssignmentFormValues | undefined {
  return features?.find((item) => item.feature_id === featureId)
}

export function PlansFeaturesFields({
  control,
  disabled = false,
}: PlansFeaturesFieldsProps) {
  const { data, isLoading } = useGetFeatures({
    status: "active",
    per_page: 100,
  })
  const catalog = data?.data ?? []
  const selected = useWatch({ control, name: "features" }) ?? []

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">Features</p>
        <p className="text-sm text-muted-foreground">
          Attach catalog features and optional limits to this plan.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Loading features...
        </div>
      ) : catalog.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No active features available. Create features first.
        </p>
      ) : (
        <Controller
          control={control}
          name="features"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {catalog.map((feature) => {
                const current = assignmentForFeature(field.value, feature.id)
                const checked = !!current
                const limitType =
                  (current?.limit_type as FeatureLimitType | undefined) ??
                  (feature.default_limit_type as FeatureLimitType | null) ??
                  "boolean"
                const needsValue =
                  checked &&
                  limitType !== "unlimited" &&
                  limitType !== "boolean"

                return (
                  <div
                    key={feature.id}
                    className="flex flex-col gap-2 rounded-md border p-2"
                  >
                    <label className="flex items-start gap-2 text-sm">
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={(value) => {
                          const isChecked = value === true
                          const next = [...(field.value ?? [])]
                          const index = next.findIndex(
                            (item) => item.feature_id === feature.id
                          )

                          if (isChecked && index === -1) {
                            next.push({
                              feature_id: feature.id,
                              limit_type:
                                (feature.default_limit_type as FeatureLimitType | null) ??
                                "boolean",
                              limit_value: feature.default_limit_value ?? null,
                              is_unlimited:
                                feature.default_limit_type === "unlimited",
                              is_enabled: true,
                              tracks_usage: feature.tracks_usage,
                            })
                          } else if (!isChecked && index >= 0) {
                            next.splice(index, 1)
                          }

                          field.onChange(next)
                        }}
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="font-medium">{feature.name}</span>
                        <span className="truncate text-muted-foreground">
                          {feature.key}
                          {feature.unit ? ` · ${feature.unit}` : ""}
                        </span>
                      </span>
                    </label>

                    {checked ? (
                      <div className="grid grid-cols-1 gap-2 ps-6 md:grid-cols-2">
                        <Field>
                          <FieldLabel>Limit type</FieldLabel>
                          <FieldContent>
                            <NativeSelect
                              className="w-full"
                              value={limitType}
                              disabled={disabled}
                              onChange={(event) => {
                                const nextType = event.target
                                  .value as FeatureLimitType
                                const next = (field.value ?? []).map((item) =>
                                  item.feature_id === feature.id
                                    ? {
                                        ...item,
                                        limit_type: nextType,
                                        is_unlimited: nextType === "unlimited",
                                        limit_value:
                                          nextType === "unlimited" ||
                                          nextType === "boolean"
                                            ? null
                                            : (item.limit_value ?? 0),
                                      }
                                    : item
                                )
                                field.onChange(next)
                              }}
                            >
                              {planFeatureLimitTypeOptions.map((option) => (
                                <NativeSelectOption
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </NativeSelectOption>
                              ))}
                            </NativeSelect>
                          </FieldContent>
                        </Field>

                        {needsValue ? (
                          <Field>
                            <FieldLabel>Limit value</FieldLabel>
                            <FieldContent>
                              <Input
                                type="number"
                                min={0}
                                disabled={disabled}
                                value={current?.limit_value ?? ""}
                                onChange={(event) => {
                                  const raw = event.target.value
                                  const next = (field.value ?? []).map(
                                    (item) =>
                                      item.feature_id === feature.id
                                        ? {
                                            ...item,
                                            limit_value:
                                              raw === "" ? null : Number(raw),
                                          }
                                        : item
                                  )
                                  field.onChange(next)
                                }}
                              />
                            </FieldContent>
                          </Field>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )
              })}

              <p className="text-xs text-muted-foreground">
                {selected.length} feature
                {selected.length === 1 ? "" : "s"} selected
              </p>
            </div>
          )}
        />
      )}
    </div>
  )
}
