"use client"

import * as React from "react"

import {Button} from "@/components/ui/button"
import {Field, FieldContent, FieldDescription, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {NativeSelect, NativeSelectOption} from "@/components/ui/native-select"
import {Spinner} from "@/components/ui/spinner"
import {Switch} from "@/components/ui/switch"
import {Textarea} from "@/components/ui/textarea"
import {BillingPaymentPolicyEditor} from "@/features/central/settings/components/billing-payment-policy-editor"
import {useBulkUpdateSettings, useSendTestMail,} from "@/features/central/settings/hooks/use-setting-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"
import type {Setting} from "@/types/central/setting"

function stringifyValue(setting: Setting): string {
    if (setting.type === "json" || setting.type === "array") {
        if (setting.value == null) {
            return ""
        }
        return typeof setting.value === "string"
            ? setting.value
            : JSON.stringify(setting.value, null, 2)
    }

    if (setting.type === "multi_select") {
        return Array.isArray(setting.value) ? setting.value.join(", ") : ""
    }

    return setting.value == null ? "" : String(setting.value)
}

const OPTION_LABELS: Record<string, string> = {
    log: "Log (write to log file)",
    smtp: "SMTP",
    array: "Array (testing)",
    local: "Local disk",
    s3: "Amazon S3",
    "": "Auto / STARTTLS",
    smtps: "SMTPS (SSL)",
    test: "Test (provider sandbox)",
    live: "Live",
    paystack: "Paystack",
    flutterwave: "Flutterwave",
    stripe: "Stripe",
    manual: "Manual",
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
    exact_currency: "Exact currency and interval only",
    default_currency: "Fall back to the default currency",
    same_interval: "Fall back to any currency with the same interval",
    any_active: "Any active price (compatibility mode)",
}

const BILLING_POLICY_KEYS = new Set([
    "billing.provider_currencies",
    "billing.gateway_by_currency",
    "billing.card_verification_amounts",
    "billing.card_verification_minimums",
    "billing.card_verification_amount",
    "billing.card_verification_currency",
])

function optionLabel(option: string): string {
    return OPTION_LABELS[option] ?? (option === "" ? "Default" : option)
}

function settingBounds(setting: Setting): string | null {
    if (
        !setting.options ||
        typeof setting.options !== "object" ||
        Array.isArray(setting.options)
    ) {
        return null
    }

    const options = setting.options as Record<string, unknown>
    if (typeof options.min === "number" && typeof options.max === "number") {
        const unit = typeof options.unit === "string" ? ` ${options.unit}` : ""
        return `Allowed range: ${options.min}–${options.max}${unit}.`
    }

    if (
        typeof options.min_length === "number" &&
        typeof options.max_length === "number"
    ) {
        return `Allowed length: ${options.min_length}–${options.max_length} characters.`
    }

    return null
}

/**
 * Driver-aware visibility for mail/storage/billing credential fields.
 * Keys not listed here are always visible.
 */
function isSettingVisible(
    key: string,
    values: Record<string, string | boolean>
): boolean {
    const mailer = String(values["mail.mailer"] ?? "")
    const disk = String(values["storage.default_disk"] ?? "")
    const provider = String(values["billing.credentials_provider"] ?? "")

    if (
        key === "mail.host" ||
        key === "mail.port" ||
        key === "mail.username" ||
        key === "mail.password" ||
        key === "mail.scheme"
    ) {
        return mailer === "smtp"
    }

    if (
        key === "storage.s3_key" ||
        key === "storage.s3_secret" ||
        key === "storage.s3_region" ||
        key === "storage.s3_bucket" ||
        key === "storage.s3_url" ||
        key === "storage.s3_endpoint" ||
        key === "storage.s3_use_path_style_endpoint"
    ) {
        return disk === "s3"
    }

    if (
        key === "billing.paystack_public" ||
        key === "billing.paystack_secret" ||
        key === "billing.paystack_webhook_secret"
    ) {
        return provider === "paystack"
    }

    if (
        key === "billing.flutterwave_public" ||
        key === "billing.flutterwave_secret" ||
        key === "billing.flutterwave_webhook_secret"
    ) {
        return provider === "flutterwave"
    }

    if (
        key === "billing.stripe_publishable" ||
        key === "billing.stripe_secret" ||
        key === "billing.stripe_webhook_secret"
    ) {
        return provider === "stripe"
    }

    return true
}

export function SettingsGroupForm({
                                      group,
                                      title,
                                      description,
                                      settings,
                                      isLoading,
                                  }: {
    group?: string
    title: string
    description?: string
    settings: Setting[]
    isLoading?: boolean
}) {
    const bulkUpdate = useBulkUpdateSettings()
    const sendTestMail = useSendTestMail()
    const [testEmail, setTestEmail] = React.useState("")
    const settingsSignature = settings
        .map((setting) => `${setting.key}:${stringifyValue(setting)}`)
        .join("|")

    const [values, setValues] = React.useState<Record<string, string | boolean>>(
        () => {
            const next: Record<string, string | boolean> = {}
            for (const setting of settings) {
                next[setting.key] =
                    setting.type === "boolean"
                        ? Boolean(setting.value)
                        : stringifyValue(setting)
            }
            return next
        }
    )
    const [dirty, setDirty] = React.useState<Set<string>>(() => new Set())
    const [loadedSignature, setLoadedSignature] =
        React.useState(settingsSignature)

    if (loadedSignature !== settingsSignature) {
        const next: Record<string, string | boolean> = {}
        for (const setting of settings) {
            next[setting.key] =
                setting.type === "boolean"
                    ? Boolean(setting.value)
                    : stringifyValue(setting)
        }
        setLoadedSignature(settingsSignature)
        setValues(next)
        setDirty(new Set())
    }

    function setValue(key: string, value: string | boolean) {
        setValues((prev) => ({...prev, [key]: value}))
        setDirty((prev) => new Set(prev).add(key))
    }

    function handleSave() {
        if (dirty.size === 0) {
            toastApiSuccess(undefined, "Nothing to save")
            return
        }

        const payload: Record<string, unknown> = {}

        for (const setting of settings) {
            if (!dirty.has(setting.key)) {
                continue
            }

            if (!isSettingVisible(setting.key, values)) {
                continue
            }

            const raw = values[setting.key]

            if (setting.is_encrypted && String(raw ?? "").trim() === "") {
                continue
            }

            if (setting.type === "json" || setting.type === "array") {
                const text = String(raw ?? "").trim()
                if (text === "") {
                    payload[setting.key] = null
                    continue
                }
                try {
                    payload[setting.key] = JSON.parse(text)
                } catch {
                    toastApiError(new Error(`"${setting.label}" must be valid JSON.`))
                    return
                }
                continue
            }

            if (setting.type === "multi_select") {
                payload[setting.key] = String(raw ?? "")
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                continue
            }

            if (setting.type === "integer") {
                payload[setting.key] = Number.parseInt(String(raw ?? "0"), 10)
                continue
            }

            if (setting.type === "float") {
                payload[setting.key] = Number.parseFloat(String(raw ?? "0"))
                continue
            }

            payload[setting.key] = raw
        }

        if (Object.keys(payload).length === 0) {
            toastApiSuccess(undefined, "Nothing to save")
            return
        }

        bulkUpdate.mutate(payload, {
            onSuccess: (result) => {
                toastApiSuccess(result.message, "Settings updated successfully")
                setDirty(new Set())
            },
            onError: (error) => toastApiError(error, "Failed to update settings"),
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner/> Loading settings...
            </div>
        )
    }

    if (settings.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No settings configured for {title}.
            </p>
        )
    }

    const visibleSettings = settings.filter(
        (setting) =>
            isSettingVisible(setting.key, values) &&
            !(group === "billing" && BILLING_POLICY_KEYS.has(setting.key))
    )

    return (
        <div className="flex flex-col gap-4">
            {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}

            {group === "billing" ? (
                <BillingPaymentPolicyEditor
                    settings={settings}
                    values={values}
                    onChange={(key, value) => setValue(key, value)}
                />
            ) : null}

            {visibleSettings.length > 0 ? (
                <FieldGroup>
                    {visibleSettings.map((setting) => (
                        <Field key={setting.key}>
                            <FieldLabel>{setting.label ?? setting.key}</FieldLabel>
                            <FieldContent>
                                <SettingInput
                                    setting={setting}
                                    value={values[setting.key]}
                                    onChange={(value) => setValue(setting.key, value)}
                                />
                                {setting.description || settingBounds(setting) ? (
                                    <FieldDescription>
                                        {[setting.description, settingBounds(setting)]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </FieldDescription>
                                ) : null}
                            </FieldContent>
                        </Field>
                    ))}
                </FieldGroup>
            ) : null}

            {group === "mail" ? (
                <div className="flex flex-col gap-3 rounded-lg border p-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">Send test email</p>
                        <p className="text-sm text-muted-foreground">
                            Uses the current mail settings (save changes first if you edited
                            them).
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        <Field className="min-w-0 flex-1">
                            <FieldLabel>Recipient</FieldLabel>
                            <FieldContent>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={testEmail}
                                    onChange={(event) => setTestEmail(event.target.value)}
                                />
                            </FieldContent>
                        </Field>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={sendTestMail.isPending || testEmail.trim() === ""}
                            onClick={() => {
                                sendTestMail.mutate(
                                    {email: testEmail.trim()},
                                    {
                                        onSuccess: (result) => {
                                            toastApiSuccess(
                                                result.message,
                                                `Test email sent to ${testEmail.trim()}`
                                            )
                                        },
                                        onError: (error) =>
                                            toastApiError(error, "Failed to send test email"),
                                    }
                                )
                            }}
                        >
                            {sendTestMail.isPending ? <Spinner/> : null}
                            Send test
                        </Button>
                    </div>
                </div>
            ) : null}

            <div className="flex justify-end">
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={bulkUpdate.isPending || dirty.size === 0}
                >
                    {bulkUpdate.isPending ? <Spinner/> : null} Save changes
                </Button>
            </div>
        </div>
    )
}

function SettingInput({
                          setting,
                          value,
                          onChange,
                      }: {
    setting: Setting
    value: string | boolean | undefined
    onChange: (value: string | boolean) => void
}) {
    if (setting.is_encrypted) {
        return (
            <Input
                type="password"
                placeholder="•••••••• (encrypted, enter a new value to replace)"
                value={typeof value === "string" ? value : ""}
                disabled={setting.is_readonly}
                onChange={(event) => onChange(event.target.value)}
            />
        )
    }

    if (setting.is_readonly) {
        return (
            <Input value={typeof value === "string" ? value : ""} disabled readOnly/>
        )
    }

    switch (setting.type) {
        case "boolean":
            return (
                <Switch
                    checked={Boolean(value)}
                    onCheckedChange={(checked) => onChange(checked)}
                />
            )

        case "select": {
            const options = Array.isArray(setting.options)
                ? (setting.options as unknown[]).map((option) => String(option))
                : []
            return (
                <NativeSelect
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                >
                    {options.map((option) => (
                        <NativeSelectOption key={option || "empty"} value={option}>
                            {optionLabel(option)}
                        </NativeSelectOption>
                    ))}
                </NativeSelect>
            )
        }

        case "json":
        case "array":
        case "textarea":
        case "rich_text":
        case "code":
            return (
                <Textarea
                    rows={setting.type === "json" || setting.type === "array" ? 6 : 4}
                    className="font-mono text-xs"
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                />
            )

        case "integer":
        case "float": {
            const constraints =
                setting.options &&
                typeof setting.options === "object" &&
                !Array.isArray(setting.options)
                    ? (setting.options as Record<string, unknown>)
                    : {}
            return (
                <Input
                    type="number"
                    step={setting.type === "float" ? "0.01" : "1"}
                    min={
                        typeof constraints.min === "number" ? constraints.min : undefined
                    }
                    max={
                        typeof constraints.max === "number" ? constraints.max : undefined
                    }
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                />
            )
        }

        case "multi_select":
            return (
                <Input
                    placeholder="value1, value2, value3"
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                />
            )

        case "color":
            return (
                <Input
                    type="color"
                    className="h-8 w-16 p-1"
                    value={typeof value === "string" ? value : "#000000"}
                    onChange={(event) => onChange(event.target.value)}
                />
            )

        default: {
            const constraints =
                setting.options &&
                typeof setting.options === "object" &&
                !Array.isArray(setting.options)
                    ? (setting.options as Record<string, unknown>)
                    : {}
            return (
                <Input
                    type={
                        setting.type === "email"
                            ? "email"
                            : setting.type === "url"
                                ? "url"
                                : "text"
                    }
                    minLength={
                        typeof constraints.min_length === "number"
                            ? constraints.min_length
                            : undefined
                    }
                    maxLength={
                        typeof constraints.max_length === "number"
                            ? constraints.max_length
                            : undefined
                    }
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                />
            )
        }
    }
}
