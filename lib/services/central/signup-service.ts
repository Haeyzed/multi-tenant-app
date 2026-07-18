import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  PlanOption,
  PublicSignupPayload,
  PublicSignupResult,
  SignupPaymentOptions,
  SignupSetupResult,
} from "@/types/central/signup"

export async function getPublicPlanOptions(params?: {
  country?: string
  currency?: string
  interval?: string
}): Promise<PlanOption[]> {
  const response = await centralApiClient.get<ApiEnvelope<PlanOption[]>>(
    "/public/plans/options",
    params
  )
  return response.data
}

export async function getSignupPaymentOptions(params: {
  country: string
}): Promise<SignupPaymentOptions> {
  const response = await centralApiClient.get<
    ApiEnvelope<SignupPaymentOptions>
  >("/public/signup/payment-options", params)
  return response.data
}

export async function publicSignupSetup(
  payload: PublicSignupPayload
): Promise<SignupSetupResult> {
  const response = await centralApiClient.post<ApiEnvelope<SignupSetupResult>>(
    "/public/signup/setup",
    payload
  )
  return response.data
}

export async function publicSignupComplete(payload: {
  signup_intent_id: string
  session_id?: string
  trxref?: string
  reference?: string
  transaction_id?: string
  id?: string
}): Promise<PublicSignupResult> {
  const response = await centralApiClient.post<ApiEnvelope<PublicSignupResult>>(
    "/public/signup/complete",
    payload
  )
  return response.data
}

export async function publicSignup(
  payload: PublicSignupPayload
): Promise<PublicSignupResult> {
  const response = await centralApiClient.post<ApiEnvelope<PublicSignupResult>>(
    "/public/signup",
    payload
  )
  return response.data
}
