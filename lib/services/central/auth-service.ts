import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  ConfirmTwoFactorPayload,
  LoginResult,
  LoginSuccessData,
  ResetPasswordPayload,
} from "@/features/central/auth/types"
import type { User } from "@/features/central/users/types"

const TWO_FACTOR_TOKEN_KEY = "central_two_factor_token"

export function setTwoFactorToken(token: string | null) {
  if (typeof window === "undefined") {
    return
  }
  if (token) {
    sessionStorage.setItem(TWO_FACTOR_TOKEN_KEY, token)
  } else {
    sessionStorage.removeItem(TWO_FACTOR_TOKEN_KEY)
  }
}

export function getTwoFactorToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  return sessionStorage.getItem(TWO_FACTOR_TOKEN_KEY)
}

export async function login(credentials: {
  email: string
  password: string
}): Promise<LoginResult> {
  const response = await centralApiClient.post<ApiEnvelope<LoginResult>>(
    "/auth/login",
    credentials
  )

  if (!response.data.requires_two_factor && response.data.token) {
    centralApiClient.setToken(response.data.token)
    setTwoFactorToken(null)
  }

  if (response.data.requires_two_factor) {
    setTwoFactorToken(response.data.two_factor_token)
  }

  return response.data
}

export async function confirmTwoFactor(
  payload: ConfirmTwoFactorPayload
): Promise<LoginSuccessData> {
  const response = await centralApiClient.post<ApiEnvelope<LoginSuccessData>>(
    "/auth/two-factor/confirm",
    payload
  )

  if (response.data.token) {
    centralApiClient.setToken(response.data.token)
  }
  setTwoFactorToken(null)

  return response.data
}

export async function forgotPassword(email: string) {
  return centralApiClient.post<ApiEnvelope<null>>("/auth/forgot-password", {
    email,
  })
}

export async function resetPassword(data: ResetPasswordPayload) {
  return centralApiClient.post<ApiEnvelope<null>>("/auth/reset-password", data)
}

export async function logout() {
  try {
    await centralApiClient.post<ApiEnvelope<null>>("/auth/logout", {})
  } finally {
    centralApiClient.setToken(null)
  }
}

export async function getProfile(signal?: AbortSignal): Promise<User> {
  const response = await centralApiClient.get<ApiEnvelope<User>>(
    "/profile",
    undefined,
    { signal }
  )
  return response.data
}
