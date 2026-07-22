"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Spinner} from "@/components/ui/spinner"
import {useForgotPassword} from "@/features/central/auth/hooks/use-auth-query"
import {forgotPasswordSchema} from "@/features/central/auth/schemas"
import {centralRoutes} from "@/features/central/shell/routes"
import {handleFormApiError} from "@/lib/form-api-errors"
import {cn} from "@/lib/utils"

export function ForgotPasswordForm({
                                       className,
                                       ...props
                                   }: React.ComponentProps<"form">) {
    const forgotPasswordMutation = useForgotPassword()

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {email: ""},
    })

    const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
        forgotPasswordMutation.mutate(values.email, {
            onSuccess: (response) => {
                toast.success(
                    response.message || "Password reset link sent to your email"
                )
            },
            onError: (error) => {
                handleFormApiError(
                    error,
                    form.setError,
                    "Failed to send reset link"
                )
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
                    <h1 className="text-2xl font-bold">Forgot your password?</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Enter your email and we&apos;ll send you a reset link.
                    </p>
                </div>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                        <Input placeholder="m@example.com" {...form.register("email")} />
                        <FieldError
                            errors={
                                form.formState.errors.email ? [form.formState.errors.email] : []
                            }
                        />
                    </FieldContent>
                </Field>
                <Field>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={forgotPasswordMutation.isPending}
                    >
                        {forgotPasswordMutation.isPending && <Spinner/>}
                        {forgotPasswordMutation.isPending
                            ? "Sending..."
                            : "Send reset link"}
                    </Button>
                </Field>
                <FieldDescription className="text-center">
                    Remember your password?{" "}
                    <Link href={centralRoutes.login} className="underline underline-offset-4">
                        Login
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}
