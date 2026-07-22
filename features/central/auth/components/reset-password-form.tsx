"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {useRouter, useSearchParams} from "next/navigation"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"

import {PasswordInput} from "@/components/ui/password-input"
import {Button} from "@/components/ui/button"
import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Spinner} from "@/components/ui/spinner"
import {useResetPassword} from "@/features/central/auth/hooks/use-auth-query"
import {resetPasswordSchema} from "@/features/central/auth/schemas"
import {centralRoutes} from "@/features/central/shell/routes"
import {handleFormApiError} from "@/lib/form-api-errors"
import {cn} from "@/lib/utils"

export function ResetPasswordForm({
                                      className,
                                      ...props
                                  }: React.ComponentProps<"form">) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const resetPasswordMutation = useResetPassword()

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: searchParams.get("email") || "",
            token: searchParams.get("token") || "",
            password: "",
            password_confirmation: "",
        },
    })

    const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
        resetPasswordMutation.mutate(values, {
            onSuccess: (response) => {
                toast.success(response.message || "Password reset successfully")
                router.push(centralRoutes.login)
            },
            onError: (error) => {
                handleFormApiError(error, form.setError, "Failed to reset password")
            },
        })
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Reset password</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Choose a new password for your account.
                    </p>
                </div>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                        <Input type="email" {...form.register("email")} />
                        <FieldError
                            errors={
                                form.formState.errors.email ? [form.formState.errors.email] : []
                            }
                        />
                    </FieldContent>
                </Field>
                {searchParams.get("token") ? (
                    <input type="hidden" {...form.register("token")} />
                ) : (
                    <Field>
                        <FieldLabel>Reset token</FieldLabel>
                        <FieldContent>
                            <Input {...form.register("token")} />
                            <FieldError
                                errors={
                                    form.formState.errors.token
                                        ? [form.formState.errors.token]
                                        : []
                                }
                            />
                        </FieldContent>
                    </Field>
                )}
                <Field>
                    <FieldLabel>New password</FieldLabel>
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
                        <PasswordInput {...form.register("password_confirmation")} />
                        <FieldError
                            errors={
                                form.formState.errors.password_confirmation
                                    ? [form.formState.errors.password_confirmation]
                                    : []
                            }
                        />
                    </FieldContent>
                </Field>
                <Field>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={resetPasswordMutation.isPending}
                    >
                        {resetPasswordMutation.isPending && <Spinner/>}
                        {resetPasswordMutation.isPending
                            ? "Resetting..."
                            : "Reset password"}
                    </Button>
                </Field>
                <FieldDescription className="text-center">
                    <Link href={centralRoutes.login} className="underline underline-offset-4">
                        Back to login
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}
