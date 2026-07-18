export type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "uncollectible"
  | "void"
  | "pending"
  | "overdue"

export type InvoiceTenantSummary = {
  id: string
  name: string | null
  slug: string | null
}

export type InvoiceSubscriptionSummary = {
  id: number
  status: string | null
  plan_name: string | null
}

export type InvoiceItem = {
  id: number
  description: string
  quantity: number
  unit_price: string | number
  total: string | number
}

export type BillingAddress = {
  id: number
  name: string
  company?: string | null
  line1: string
  line2?: string | null
  city: string
  state?: string | null
  postal_code: string
  country: string
  tax_id?: string | null
  tax_type?: string | null
  is_default?: boolean
}

export type Invoice = {
  id: number
  tenant_id: string
  subscription_id: number | null
  number: string
  status: InvoiceStatus
  status_label?: string | null
  subtotal: string | number
  tax_rate: string | number | null
  tax: string | number
  total: string | number
  amount_paid: string | number
  balance_due: string | number
  currency: string
  tax_id: string | null
  issued_at: string | null
  due_at: string | null
  paid_at: string | null
  notes: string | null
  tenant?: InvoiceTenantSummary | null
  subscription?: InvoiceSubscriptionSummary | null
  items?: InvoiceItem[]
  billing_address?: BillingAddress | null
  created_at: string
}

export type PaginatedMeta = {
  current_page: number
  from?: number | null
  last_page: number
  per_page: number
  to?: number | null
  total: number
  path?: string
}

export type PaginatedInvoices = {
  data: Invoice[]
  meta: PaginatedMeta
}

export type InvoiceStatistics = {
  total: number
  draft: number
  open: number
  paid: number
  overdue: number
  void: number
  volume: number
  by_status: Record<string, number>
}
