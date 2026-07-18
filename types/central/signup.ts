export type PlanOption = {
  value: number
  label: string
  currency?: string | null
  amount?: string | number | null
  billing_interval?: string | null
}

export type SignupGatewayOption = {
  value: string
  label: string
  recommended: boolean
}

export type SignupPaymentOptions = {
  currency: string
  gateways: SignupGatewayOption[]
}

export type BillingAddressInput = {
  name?: string
  company?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal_code?: string
  tax_id?: string
  tax_type?: string
}

export type PublicSignupPayload = {
  name: string
  email: string
  password: string
  password_confirmation: string
  plan_id: number
  country: string
  gateway?: string
  slug?: string
  phone?: string | null
  domain?: string | null
  owner_name?: string | null
  billing_interval?: string | null
  billing_address?: BillingAddressInput | null
}

export type PublicSignupResult = {
  tenant: {
    id: number
    name: string
    slug: string
    email: string
  }
  subscription: {
    id: number
    status: string
  }
  login: {
    primary_domain: string | null
    auth_base_path: string
    message: string
  }
}

export type SignupSetupResult = {
  signup_intent_id: string
  checkout_url: string
  gateway: string
  currency: string
  expires_at: string
}
