"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {CheckIcon} from "lucide-react"
import Link from "next/link"
import {useEffect, useMemo, useState} from "react"
import {Controller, useForm} from "react-hook-form"

import {PhoneInput} from "@/components/reui/phone-input"
import {
    Stepper,
    StepperContent,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperPanel,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from "@/components/reui/stepper"
import {PasswordInput} from "@/components/ui/password-input"
import {Button, buttonVariants} from "@/components/ui/button"
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
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Spinner} from "@/components/ui/spinner"
import {
    usePublicPlanOptions,
    usePublicSignupSetup,
    useSignupPaymentOptions,
} from "@/features/central/auth/hooks/use-signup-query"
import {type SignupFormValues, signupSchema,} from "@/features/central/auth/schemas"
import {centralRoutes} from "@/features/central/shell/routes"
import {useCountryOptions} from "@/features/central/world/hooks/use-world-query"
import {handleFormApiError} from "@/lib/form-api-errors"
import type {PlanOption, PublicSignupResult, SignupGatewayOption,} from "@/features/central/auth/types"
import type {CountryOption} from "@/features/central/world/types"
import {cn} from "@/lib/utils"

const steps = [
    {step: 1, title: "Location"},
    {step: 2, title: "Plan"},
    {step: 3, title: "Organization"},
    {step: 4, title: "Owner"},
    {step: 5, title: "Payment"},
    {step: 6, title: "Review"},
] as const

function tenantLoginUrl(domain: string | null): string | null {
    if (!domain) {
        return null
    }
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
        return domain
    }
    return `https://${domain}`
}

function formatPlanPrice(plan: {
    currency?: string | null
    amount?: string | number | null
    billing_interval?: string | null
}): string | null {
    if (!plan.currency || plan.amount == null) {
        return null
    }
    const amount = Number(plan.amount).toFixed(2)
    const interval = plan.billing_interval
        ? `/${plan.billing_interval === "monthly" ? "mo" : plan.billing_interval === "yearly" ? "yr" : plan.billing_interval}`
        : ""
    return `${plan.currency} ${amount}${interval}`
}

export function SignupForm({className}: { className?: string }) {
    const [activeStep, setActiveStep] = useState(1)
    const [result, setResult] = useState<PublicSignupResult | null>(null)
    const {data: countryOptions = [], isLoading: countriesLoading} =
        useCountryOptions()
    const signupMutation = usePublicSignupSetup()

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            country: "",
            plan_id: undefined as unknown as number,
            name: "",
            slug: "",
            domain: "",
            owner_name: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
            gateway: "",
            billing_line1: "",
            billing_city: "",
            billing_postal_code: "",
        },
        mode: "onTouched",
    })

    const values = form.watch()

    const {data: planOptions = [], isLoading: plansLoading} =
        usePublicPlanOptions({country: values.country || undefined})

    const {
        data: paymentOptions,
        isLoading: paymentOptionsLoading,
    } = useSignupPaymentOptions({country: values.country || undefined})

    const gatewayChoices = useMemo(() => {
        return (paymentOptions?.gateways ?? []).map((option) => ({
            value: option.value,
            label: option.recommended
                ? `${option.label} (recommended)`
                : option.label,
            recommended: option.recommended,
        }))
    }, [paymentOptions?.gateways])

    useEffect(() => {
        if (!values.country) {
            form.setValue("gateway", "")
            return
        }

        if (!paymentOptions?.gateways?.length) {
            if (!paymentOptionsLoading) {
                form.setValue("gateway", "")
            }
            return
        }

        const current = form.getValues("gateway")
        if (paymentOptions.gateways.some((option) => option.value === current)) {
            return
        }

        const recommended =
            paymentOptions.gateways.find((option) => option.recommended) ??
            paymentOptions.gateways[0]
        form.setValue("gateway", recommended.value, {shouldValidate: true})
    }, [values.country, paymentOptions, paymentOptionsLoading, form])

    const selectedCountryLabel = useMemo(() => {
        return countryOptions.find(
            (option: CountryOption) => option.value === values.country
        )?.label
    }, [countryOptions, values.country])

    const selectedPlan = useMemo(() => {
        return planOptions.find(
            (plan: PlanOption) => plan.value === values.plan_id
        )
    }, [planOptions, values.plan_id])

    const selectedGatewayLabel = useMemo(() => {
        return gatewayChoices.find((option) => option.value === values.gateway)
            ?.label
    }, [gatewayChoices, values.gateway])

    const goNextFromLocation = async () => {
        const valid = await form.trigger("country")
        if (valid) {
            setActiveStep(2)
        }
    }

    const goNextFromPlan = async () => {
        const valid = await form.trigger("plan_id")
        if (valid) {
            setActiveStep(3)
        }
    }

    const goNextFromOrg = async () => {
        const valid = await form.trigger(["name", "slug", "domain"])
        if (valid) {
            setActiveStep(4)
        }
    }

    const goNextFromOwner = async () => {
        const valid = await form.trigger([
            "owner_name",
            "email",
            "phone",
            "password",
            "password_confirmation",
        ])
        if (valid) {
            setActiveStep(5)
        }
    }

    const goNextFromPayment = async () => {
        if (!paymentOptions?.gateways?.length) {
            form.setError("gateway", {
                message: "No payment providers are available for this currency.",
            })
            return
        }
        const valid = await form.trigger("gateway")
        if (valid) {
            setActiveStep(6)
        }
    }

    const onSubmit = (formValues: SignupFormValues) => {
        const billingAddress =
            formValues.billing_line1 ||
            formValues.billing_city ||
            formValues.billing_postal_code
                ? {
                    line1: formValues.billing_line1 || undefined,
                    city: formValues.billing_city || undefined,
                    postal_code: formValues.billing_postal_code || undefined,
                }
                : undefined

        signupMutation.mutate(
            {
                plan_id: formValues.plan_id,
                country: formValues.country,
                gateway: formValues.gateway,
                name: formValues.name,
                email: formValues.email,
                password: formValues.password,
                password_confirmation: formValues.password_confirmation,
                slug: formValues.slug || undefined,
                domain: formValues.domain || undefined,
                phone: formValues.phone || undefined,
                owner_name: formValues.owner_name || undefined,
                billing_address: billingAddress,
            },
            {
                onSuccess: (data) => {
                    if (data.checkout_url) {
                        window.location.assign(data.checkout_url)
                        return
                    }
                },
                onError: (error) => {
                    handleFormApiError(error, form.setError, "Signup failed")
                    setActiveStep(6)
                },
            }
        )
    }

    if (result && activeStep === 7) {
        const loginUrl = tenantLoginUrl(result.login.primary_domain)

        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">You&apos;re all set</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        {result.login.message}
                    </p>
                </div>
                <div className="space-y-2 rounded-lg border p-4 text-sm">
                    <p>
                        <span className="text-muted-foreground">Organization:</span>{" "}
                        {result.tenant.name}
                    </p>
                    <p>
                        <span className="text-muted-foreground">Domain:</span>{" "}
                        {result.login.primary_domain || "Pending"}
                    </p>
                    <p>
                        <span className="text-muted-foreground">Subscription:</span>{" "}
                        {result.subscription.status}
                    </p>
                </div>
                {loginUrl ? (
                    <a
                        href={loginUrl}
                        className={cn(buttonVariants(), "w-full")}
                    >
                        Continue to tenant login
                    </a>
                ) : null}
                <FieldDescription className="text-center">
                    Platform admin?{" "}
                    <Link href={centralRoutes.login} className="underline underline-offset-4">
                        Central login
                    </Link>
                </FieldDescription>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Start your free trial</h1>
                <p className="text-sm text-balance text-muted-foreground">
                    Create your organization — pay later when the trial ends.
                </p>
            </div>

            <Stepper
                value={activeStep}
                onValueChange={setActiveStep}
                className="space-y-6"
            >
                <StepperNav className="gap-1">
                    {steps.map((item, index) => (
                        <StepperItem
                            key={item.step}
                            step={item.step}
                            className="relative flex-1 items-start"
                        >
                            <StepperTrigger
                                className="flex w-full flex-col items-center gap-2 rounded"
                                disabled={item.step > activeStep}
                            >
                                <StepperIndicator className="size-8">
                                    {activeStep > item.step ? (
                                        <CheckIcon className="size-4"/>
                                    ) : (
                                        item.step
                                    )}
                                </StepperIndicator>
                                <StepperTitle className="hidden text-xs sm:block">
                                    {item.title}
                                </StepperTitle>
                            </StepperTrigger>
                            {index < steps.length - 1 && (
                                <StepperSeparator
                                    className="absolute inset-x-0 top-4 start-[calc(50%+1.25rem)] m-0 group-data-[orientation=horizontal]/stepper:w-[calc(100%-2.5rem)] group-data-[orientation=horizontal]/stepper:flex-none"/>
                            )}
                        </StepperItem>
                    ))}
                </StepperNav>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <StepperPanel>
                        <StepperContent value={1} className="space-y-4">
                            <Field>
                                <FieldLabel>Where are you located?</FieldLabel>
                                <FieldContent>
                                    {countriesLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Spinner/> Loading countries...
                                        </div>
                                    ) : (
                                        <Controller
                                            control={form.control}
                                            name="country"
                                            render={({field}) => {
                                                const selected =
                                                    countryOptions.find(
                                                        (option: CountryOption) =>
                                                            option.value === field.value
                                                    ) ?? null
                                                return (
                                                    <Combobox
                                                        items={countryOptions}
                                                        itemToStringValue={(item) => item.label}
                                                        value={selected}
                                                        onValueChange={(item) =>
                                                            field.onChange(item?.value ?? "")
                                                        }
                                                    >
                                                        <ComboboxInput placeholder="Select your country..."/>
                                                        <ComboboxContent>
                                                            <ComboboxEmpty>No countries found.</ComboboxEmpty>
                                                            <ComboboxList>
                                                                {(item) => (
                                                                    <ComboboxItem key={item.value} value={item}>
                                                                        {item.label}
                                                                    </ComboboxItem>
                                                                )}
                                                            </ComboboxList>
                                                        </ComboboxContent>
                                                    </Combobox>
                                                )
                                            }}
                                        />
                                    )}
                                    <FieldError
                                        errors={
                                            form.formState.errors.country
                                                ? [form.formState.errors.country]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>
                            <FieldDescription>
                                We use this to show pricing in your local currency and which
                                payment providers you can use.
                            </FieldDescription>
                            <Button
                                type="button"
                                className="w-full"
                                onClick={goNextFromLocation}
                            >
                                Continue
                            </Button>
                        </StepperContent>

                        <StepperContent value={2} className="space-y-4">
                            <Field>
                                <FieldLabel>Choose a plan</FieldLabel>
                                <FieldContent>
                                    {plansLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Spinner/> Loading plans...
                                        </div>
                                    ) : (
                                        <Controller
                                            control={form.control}
                                            name="plan_id"
                                            render={({field}) => (
                                                <RadioGroup
                                                    value={
                                                        field.value != null ? String(field.value) : ""
                                                    }
                                                    onValueChange={(value) =>
                                                        field.onChange(Number(value))
                                                    }
                                                    className="gap-3"
                                                >
                                                    {planOptions.map((plan: PlanOption) => {
                                                        const priceLabel = formatPlanPrice(plan)
                                                        const planName = plan.label.split(" — ")[0]
                                                        return (
                                                            <Label
                                                                key={plan.value}
                                                                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 has-data-checked:border-primary"
                                                            >
                                <span className="flex items-center gap-3">
                                  <RadioGroupItem value={String(plan.value)}/>
                                  <span>{planName}</span>
                                </span>
                                                                {priceLabel ? (
                                                                    <span className="text-sm text-muted-foreground">
                                    {priceLabel}
                                  </span>
                                                                ) : null}
                                                            </Label>
                                                        )
                                                    })}
                                                </RadioGroup>
                                            )}
                                        />
                                    )}
                                    <FieldError
                                        errors={
                                            form.formState.errors.plan_id
                                                ? [form.formState.errors.plan_id]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setActiveStep(1)}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={goNextFromPlan}
                                >
                                    Continue
                                </Button>
                            </div>
                        </StepperContent>

                        <StepperContent value={3} className="space-y-4">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Organization name</FieldLabel>
                                    <FieldContent>
                                        <Input {...form.register("name")} placeholder="Acme Inc."/>
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
                                    <FieldLabel>Slug (optional)</FieldLabel>
                                    <FieldContent>
                                        <Input {...form.register("slug")} placeholder="acme-inc"/>
                                        <FieldError
                                            errors={
                                                form.formState.errors.slug
                                                    ? [form.formState.errors.slug]
                                                    : []
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Custom domain (optional)</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            {...form.register("domain")}
                                            placeholder="acme.example.test"
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.domain
                                                    ? [form.formState.errors.domain]
                                                    : []
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldGroup>

                            <FieldSeparator>Billing address (optional)</FieldSeparator>

                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Address line 1</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            {...form.register("billing_line1")}
                                            placeholder="123 Market Street"
                                        />
                                    </FieldContent>
                                </Field>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Field>
                                        <FieldLabel>City</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                {...form.register("billing_city")}
                                                placeholder="Lagos"
                                            />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Postal code</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                {...form.register("billing_postal_code")}
                                                placeholder="100001"
                                            />
                                        </FieldContent>
                                    </Field>
                                </div>
                            </FieldGroup>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setActiveStep(2)}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={goNextFromOrg}
                                >
                                    Continue
                                </Button>
                            </div>
                        </StepperContent>

                        <StepperContent value={4} className="space-y-4">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Owner name (optional)</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            {...form.register("owner_name")}
                                            placeholder="Jane Owner"
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="email"
                                            {...form.register("email")}
                                            placeholder="owner@acme.test"
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.email
                                                    ? [form.formState.errors.email]
                                                    : []
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Phone (optional)</FieldLabel>
                                    <FieldContent>
                                        <Controller
                                            control={form.control}
                                            name="phone"
                                            render={({field}) => (
                                                <PhoneInput
                                                    value={field.value || undefined}
                                                    onChange={(value) => field.onChange(value || "")}
                                                    defaultCountry={
                                                        (values.country as never) || "NG"
                                                    }
                                                />
                                            )}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <FieldContent>
                                        <PasswordInput {...form.register("password")} />
                                        <FieldError
                                            errors={
                                                form.formState.errors.password
                                                    ? [form.formState.errors.password]
                                                    : []
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Confirm password</FieldLabel>
                                    <FieldContent>
                                        <PasswordInput
                                            {...form.register("password_confirmation")}
                                        />
                                        <FieldError
                                            errors={
                                                form.formState.errors.password_confirmation
                                                    ? [form.formState.errors.password_confirmation]
                                                    : []
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldGroup>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setActiveStep(3)}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={goNextFromOwner}
                                >
                                    Continue
                                </Button>
                            </div>
                        </StepperContent>

                        <StepperContent value={5} className="space-y-4">
                            <Field>
                                <FieldLabel>Payment currency</FieldLabel>
                                <FieldContent>
                                    <p className="text-sm">
                                        {paymentOptionsLoading
                                            ? "Resolving currency…"
                                            : (paymentOptions?.currency ?? "—")}
                                    </p>
                                    <FieldDescription>
                                        Based on your country. Choose a provider that supports this
                                        currency.
                                    </FieldDescription>
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Payment provider</FieldLabel>
                                <FieldContent>
                                    {paymentOptionsLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Spinner/> Loading providers...
                                        </div>
                                    ) : gatewayChoices.length === 0 ? (
                                        <p className="text-destructive text-sm">
                                            No payment providers are available for this currency.
                                            Choose a different country or contact support.
                                        </p>
                                    ) : (
                                        <Controller
                                            control={form.control}
                                            name="gateway"
                                            render={({field}) => {
                                                const selected =
                                                    gatewayChoices.find(
                                                        (option) => option.value === field.value
                                                    ) ?? null
                                                return (
                                                    <Combobox
                                                        items={gatewayChoices}
                                                        itemToStringValue={(
                                                            item: SignupGatewayOption & { label: string }
                                                        ) => item.label}
                                                        value={selected}
                                                        onValueChange={(item) =>
                                                            field.onChange(item?.value ?? "")
                                                        }
                                                    >
                                                        <ComboboxInput placeholder="Select a provider..."/>
                                                        <ComboboxContent>
                                                            <ComboboxEmpty>No providers found.</ComboboxEmpty>
                                                            <ComboboxList>
                                                                {(item) => (
                                                                    <ComboboxItem key={item.value} value={item}>
                                                                        {item.label}
                                                                    </ComboboxItem>
                                                                )}
                                                            </ComboboxList>
                                                        </ComboboxContent>
                                                    </Combobox>
                                                )
                                            }}
                                        />
                                    )}
                                    <FieldError
                                        errors={
                                            form.formState.errors.gateway
                                                ? [form.formState.errors.gateway]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>

                            <p className="text-muted-foreground text-sm">
                                We will not charge your plan yet — we only confirm your card
                                works.
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setActiveStep(4)}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={goNextFromPayment}
                                    disabled={
                                        paymentOptionsLoading || gatewayChoices.length === 0
                                    }
                                >
                                    Continue
                                </Button>
                            </div>
                        </StepperContent>

                        <StepperContent value={6} className="space-y-4">
                            <div className="space-y-2 rounded-lg border p-4 text-sm">
                                <p>
                                    <span className="text-muted-foreground">Country:</span>{" "}
                                    {selectedCountryLabel || values.country}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Currency:</span>{" "}
                                    {paymentOptions?.currency ?? "—"}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Provider:</span>{" "}
                                    {selectedGatewayLabel || values.gateway}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Plan:</span>{" "}
                                    {selectedPlan?.label.split(" — ")[0] || values.plan_id}
                                    {selectedPlan ? (
                                        <span className="text-muted-foreground">
                      {" "}
                                            ({formatPlanPrice(selectedPlan)})
                    </span>
                                    ) : null}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Organization:</span>{" "}
                                    {values.name}
                                </p>
                                {values.slug ? (
                                    <p>
                                        <span className="text-muted-foreground">Slug:</span>{" "}
                                        {values.slug}
                                    </p>
                                ) : null}
                                {values.domain ? (
                                    <p>
                                        <span className="text-muted-foreground">Domain:</span>{" "}
                                        {values.domain}
                                    </p>
                                ) : null}
                                {values.billing_line1 || values.billing_city ? (
                                    <p>
                    <span className="text-muted-foreground">
                      Billing address:
                    </span>{" "}
                                        {[
                                            values.billing_line1,
                                            values.billing_city,
                                            values.billing_postal_code,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                ) : null}
                                <p>
                                    <span className="text-muted-foreground">Owner email:</span>{" "}
                                    {values.email}
                                </p>
                                {values.phone ? (
                                    <p>
                                        <span className="text-muted-foreground">Phone:</span>{" "}
                                        {values.phone}
                                    </p>
                                ) : null}
                            </div>
                            <p className="text-muted-foreground text-sm">
                                We will not charge your plan yet — we only confirm your card
                                works, then start your free trial.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setActiveStep(5)}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={signupMutation.isPending}
                                >
                                    {signupMutation.isPending && <Spinner/>}
                                    {signupMutation.isPending
                                        ? "Redirecting…"
                                        : "Verify card & create account"}
                                </Button>
                            </div>
                        </StepperContent>
                    </StepperPanel>
                </form>
            </Stepper>

            <FieldDescription className="text-center">
                Already have a platform account?{" "}
                <Link href={centralRoutes.login} className="underline underline-offset-4">
                    Login
                </Link>
            </FieldDescription>
        </div>
    )
}
