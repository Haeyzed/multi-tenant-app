export type SettingType =
  | "string"
  | "integer"
  | "float"
  | "boolean"
  | "json"
  | "array"
  | "file"
  | "encrypted"
  | "color"
  | "url"
  | "email"
  | "date"
  | "datetime"
  | "timezone"
  | "select"
  | "multi_select"
  | "textarea"
  | "rich_text"
  | "code"

export type Setting = {
  id: number
  group: string | null
  group_label?: string | null
  key: string
  label: string | null
  description?: string | null
  type: SettingType | null
  type_label?: string | null
  value: unknown
  has_value: boolean
  is_masked: boolean
  default_value: unknown
  options?: unknown
  is_public: boolean
  is_encrypted: boolean
  is_readonly: boolean
  sort_order: number
  created_at?: string | null
  updated_at?: string | null
}

export type SettingGroupOption = {
  value: string
  label: string
}

export type GroupedSettings = Record<string, Setting[]>

export type PublicSettings = Record<string, unknown>

export type InvoiceSettings = {
  company_name: string | null
  logo_url: string | null
  company_email: string | null
  company_phone: string | null
  company_website: string | null
  company_address: string | null
  company_tax_id: string | null
  number_prefix: string | null
  footer_note: string | null
}
