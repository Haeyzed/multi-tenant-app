export type FeatureCategory = {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  features_count?: number | null
  created_at: string
  created_at_human?: string | null
  updated_at?: string | null
  updated_at_human?: string | null
}
