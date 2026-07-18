import type { CentralUser } from "@/types/central/user"

export type LoginSuccessData = {
  token: string
  token_type: string
  user: CentralUser
  requires_two_factor: false
}

export type LoginTwoFactorData = {
  requires_two_factor: true
  two_factor_token: string
  user: { email: string }
}

export type LoginResult = LoginSuccessData | LoginTwoFactorData

export type ConfirmTwoFactorPayload = {
  two_factor_token: string
  two_factor_code?: string
  recovery_code?: string
  device_name?: string
}

export type ResetPasswordPayload = {
  token: string
  email: string
  password: string
  password_confirmation: string
}
