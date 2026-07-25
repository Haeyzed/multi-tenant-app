"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import * as React from "react"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Field, FieldContent, FieldDescription, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Spinner} from "@/components/ui/spinner"
import {Switch} from "@/components/ui/switch"
import {
    getPaymentGateways,
    type PaymentGatewayCatalogItem,
    type PaymentGatewayConfigSummary,
    updatePaymentGatewayConfig,
} from "@/lib/services/central/payment-gateway-service"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"

function GatewayEnvironmentFields({
                                      gateway,
                                      environment,
                                      current,
                                  }: {
    gateway: PaymentGatewayCatalogItem
    environment: "test" | "live"
    current?: PaymentGatewayConfigSummary
}) {
    const queryClient = useQueryClient()
    const [publicKey, setPublicKey] = React.useState(current?.public_key ?? "")
    const [secretKey, setSecretKey] = React.useState("")
    const [webhookSecret, setWebhookSecret] = React.useState("")
    const [isActive, setIsActive] = React.useState(current?.is_active ?? true)

    const save = useMutation({
        mutationFn: () =>
            updatePaymentGatewayConfig(gateway.slug, {
                environment,
                public_key: publicKey.trim() || null,
                secret_key: secretKey.trim() || null,
                webhook_secret: webhookSecret.trim() || null,
                is_active: isActive,
            }),
        onSuccess: (result) => {
            toastApiSuccess(result.message, "Gateway credentials saved")
            setSecretKey("")
            setWebhookSecret("")
            queryClient.invalidateQueries({queryKey: ["central", "payment-gateways"]})
        },
        onError: (error) => toastApiError(error, "Failed to save gateway credentials"),
    })

    return (
        <div className="flex flex-col gap-3 rounded-md border bg-muted/20 p-3">
            <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium capitalize">{environment} credentials</p>
                <Badge variant="outline">
                    {current?.has_secret_key ? "Secret stored" : "No secret"}
                </Badge>
            </div>

            <FieldGroup className="gap-3">
                <Field>
                    <FieldLabel>Public key</FieldLabel>
                    <FieldContent>
                        <Input
                            value={publicKey}
                            onChange={(event) => setPublicKey(event.target.value)}
                            placeholder="pk_..."
                            autoComplete="off"
                        />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Secret key</FieldLabel>
                    <FieldContent>
                        <Input
                            type="password"
                            value={secretKey}
                            onChange={(event) => setSecretKey(event.target.value)}
                            placeholder={
                                current?.has_secret_key
                                    ? "Leave blank to keep existing secret"
                                    : "sk_..."
                            }
                            autoComplete="new-password"
                        />
                        {current?.has_secret_key ? (
                            <FieldDescription>A secret is already stored.</FieldDescription>
                        ) : null}
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Webhook secret</FieldLabel>
                    <FieldContent>
                        <Input
                            type="password"
                            value={webhookSecret}
                            onChange={(event) => setWebhookSecret(event.target.value)}
                            placeholder={
                                current?.has_webhook_secret
                                    ? "Leave blank to keep existing webhook secret"
                                    : "whsec_..."
                            }
                            autoComplete="new-password"
                        />
                    </FieldContent>
                </Field>
                <Field orientation="horizontal" className="items-center justify-between">
                    <FieldLabel>Active for {environment}</FieldLabel>
                    <Switch checked={isActive} onCheckedChange={setIsActive}/>
                </Field>
            </FieldGroup>

            <div className="flex justify-end">
                <Button size="sm" disabled={save.isPending} onClick={() => save.mutate()}>
                    {save.isPending ? <Spinner/> : null}
                    Save {environment}
                </Button>
            </div>
        </div>
    )
}

export function PaymentGatewaysCatalogCard() {
    const {data: gateways = [], isLoading, isError} = useQuery({
        queryKey: ["central", "payment-gateways"],
        queryFn: getPaymentGateways,
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment gateway catalog</CardTitle>
                <CardDescription>
                    Providers and nested <code className="text-xs">test</code> /{" "}
                    <code className="text-xs">live</code> credentials stored in{" "}
                    <code className="text-xs">payment_gateway_configs</code>. Seed from{" "}
                    <code className="text-xs">.env</code> with PaymentGatewaySeeder, then edit
                    either environment here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Spinner/> Loading gateways...
                    </div>
                ) : isError ? (
                    <p className="text-sm text-muted-foreground">
                        Unable to load payment gateways. Ensure you have
                        billing.gateways.view permission.
                    </p>
                ) : gateways.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No gateways found. Run PaymentGatewaySeeder on the API.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {gateways.map((gateway) => {
                            const configs = gateway.configs ?? []
                            const testConfig = configs.find((c) => c.environment === "test")
                            const liveConfig = configs.find((c) => c.environment === "live")

                            return (
                                <div
                                    key={gateway.slug}
                                    className="rounded-md border px-3 py-3 text-sm"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-medium">{gateway.name}</span>
                                                <Badge variant="outline">{gateway.slug}</Badge>
                                                {gateway.is_fallback ? (
                                                    <Badge variant="secondary">Fallback</Badge>
                                                ) : null}
                                                {gateway.is_active === false ? (
                                                    <Badge variant="outline">Inactive</Badge>
                                                ) : null}
                                            </div>
                                            {gateway.currencies && gateway.currencies.length > 0 ? (
                                                <p className="text-muted-foreground">
                                                    Currencies: {gateway.currencies.join(", ")}
                                                </p>
                                            ) : null}
                                            {gateway.countries && gateway.countries.length > 0 ? (
                                                <p className="text-muted-foreground">
                                                    Countries: {gateway.countries.join(", ")}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {gateway.supports_recurring ? (
                                                <Badge variant="outline">Recurring</Badge>
                                            ) : null}
                                            {gateway.supports_refunds ? (
                                                <Badge variant="outline">Refunds</Badge>
                                            ) : null}
                                            {gateway.supports_webhook ? (
                                                <Badge variant="outline">Webhooks</Badge>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                                        <GatewayEnvironmentFields
                                            key={`${gateway.slug}-test-${testConfig?.id ?? "new"}`}
                                            gateway={gateway}
                                            environment="test"
                                            current={testConfig}
                                        />
                                        <GatewayEnvironmentFields
                                            key={`${gateway.slug}-live-${liveConfig?.id ?? "new"}`}
                                            gateway={gateway}
                                            environment="live"
                                            current={liveConfig}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
