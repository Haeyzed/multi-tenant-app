"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {PasswordInput} from "@/components/ui/password-input"
import {Button} from "@/components/ui/button"
import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Spinner} from "@/components/ui/spinner"
import {useLogin} from "@/features/central/auth/hooks/use-auth-query"
import {loginSchema} from "@/features/central/auth/schemas"
import {centralRoutes} from "@/features/central/shell/routes"
import {handleFormApiError} from "@/lib/form-api-errors"
import {cn} from "@/lib/utils"

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"form">) {
    const router = useRouter()
    const loginMutation = useLogin()
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {email: "", password: ""},
    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        loginMutation.mutate(values, {
            onSuccess: (data) => {
                if (data.requires_two_factor) {
                    router.push(centralRoutes.twoFactor)
                    return
                }
                router.push(centralRoutes.dashboard)
            },
            onError: (error) => {
                handleFormApiError(error, form.setError, "Login failed")
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
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Enter your email below to login to your account
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
                    <div className="flex items-center">
                        <FieldLabel>Password</FieldLabel>
                        <Link
                            href={centralRoutes.forgotPassword}
                            className="ms-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
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
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending && <Spinner/>}
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                </Field>
                <FieldDescription className="text-center">
                    Starting a business?{" "}
                    <Link href={centralRoutes.signup} className="underline underline-offset-4">
                        Create a trial
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}
