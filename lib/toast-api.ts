import { toast } from "sonner"

export function toastApiSuccess(message?: string | null, fallback = "Success") {
  toast.success(message || fallback)
}

export function toastApiError(error: unknown, fallback = "Something went wrong") {
  const message =
    error instanceof Error && error.message ? error.message : fallback
  toast.error(message)
}
