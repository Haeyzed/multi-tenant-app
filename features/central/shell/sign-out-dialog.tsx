"use client"

import {useRouter} from "next/navigation"
import {toast} from "sonner"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {Spinner} from "@/components/ui/spinner"
import {useLogout} from "@/features/central/auth/hooks/use-auth-query"
import {centralRoutes} from "@/features/central/shell/routes"

type SignOutDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SignOutDialog({open, onOpenChange}: SignOutDialogProps) {
    const router = useRouter()
    const logoutMutation = useLogout()

    const handleSignOut = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                onOpenChange(false)
                router.push(centralRoutes.login)
            },
            onError: (error) => {
                toast.error(error.message || "Failed to sign out")
            },
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sign out</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to sign out? You will need to sign in again to
                        access your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleSignOut}
                        disabled={logoutMutation.isPending}
                    >
                        {logoutMutation.isPending ? <Spinner/> : null}
                        Sign out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
