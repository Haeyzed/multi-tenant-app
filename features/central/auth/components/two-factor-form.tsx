"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {useEffect, useState} from "react"
import {Controller, useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/components/ui/input-otp"
import {Input} from "@/components/ui/input"
import {Spinner} from "@/components/ui/spinner"
import {useConfirmTwoFactor} from "@/features/central/auth/hooks/use-auth-query"
import {twoFactorSchema} from "@/features/central/auth/schemas"
import {centralRoutes} from "@/features/central/shell/routes"
import {handleFormApiError} from "@/lib/form-api-errors"
import {getTwoFactorToken} from "@/lib/services/central/auth-service"
import {cn} from "@/lib/utils"

export function TwoFactorForm({
                                  className,
                                  ...props
                              }: React.ComponentProps<"form">) {
    const router = useRouter()
    const confirmMutation = useConfirmTwoFactor()
    const [useRecovery, setUseRecovery] = useState(false)
    const twoFactorToken = getTwoFactorToken()

    const form = useForm<z.infer<typeof twoFactorSchema>>({
        resolver: zodResolver(twoFactorSchema),
        defaultValues: {two_factor_code: "", recovery_code: ""},
    })

    useEffect(() => {
        if (!twoFactorToken) {
            router.replace(centralRoutes.login)
        }
    }, [router, twoFactorToken])

    const onSubmit = (values: z.infer<typeof twoFactorSchema>) => {
        if (!twoFactorToken) {
            router.replace(centralRoutes.login)
            return
        }

        confirmMutation.mutate(
            {
                two_factor_token: twoFactorToken,
                two_factor_code: useRecovery ? undefined : values.two_factor_code,
                recovery_code: useRecovery ? values.recovery_code : undefined,
            },
            {
                onSuccess: () => {
                    router.push(centralRoutes.dashboard)
                },
                onError: (error) => {
                    handleFormApiError(error, form.setError, "Verification failed")
                },
            }
        )
    }

    if (!twoFactorToken) {
        return null
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Two-factor authentication</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        {useRecovery
                            ? "Enter one of your recovery codes."
                            : "Enter the 6-digit code from your authenticator app."}
                    </p>
                </div>

                {useRecovery ? (
                    <Field>
                        <FieldLabel>Recovery code</FieldLabel>
                        <FieldContent>
                            <Input
                                placeholder="abcd-efgh-ijkl"
                                {...form.register("recovery_code")}
                            />
                            <FieldError
                                errors={
                                    form.formState.errors.recovery_code
                                        ? [form.formState.errors.recovery_code]
                                        : []
                                }
                            />
                        </FieldContent>
                    </Field>
                ) : (
                    <Field>
                        <FieldLabel>Authentication code</FieldLabel>
                        <FieldContent>
                            <Controller
                                control={form.control}
                                name="two_factor_code"
                                render={({field}) => (
                                    <InputOTP
                                        maxLength={6}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0}/>
                                            <InputOTPSlot index={1}/>
                                            <InputOTPSlot index={2}/>
                                            <InputOTPSlot index={3}/>
                                            <InputOTPSlot index={4}/>
                                            <InputOTPSlot index={5}/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                )}
                            />
                            <FieldError
                                errors={
                                    form.formState.errors.two_factor_code
                                        ? [form.formState.errors.two_factor_code]
                                        : []
                                }
                            />
                        </FieldContent>
                    </Field>
                )}

                <Field>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={confirmMutation.isPending}
                    >
                        {confirmMutation.isPending && <Spinner/>}
                        {confirmMutation.isPending ? "Verifying..." : "Verify"}
                    </Button>
                </Field>

                <FieldDescription className="text-center">
                    <button
                        type="button"
                        className="underline underline-offset-4"
                        onClick={() => {
                            setUseRecovery((prev) => !prev)
                            form.reset({two_factor_code: "", recovery_code: ""})
                        }}
                    >
                        {useRecovery ? "Use authenticator code" : "Use a recovery code"}
                    </button>
                    {" · "}
                    <Link href={centralRoutes.login} className="underline underline-offset-4">
                        Back to login
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}
