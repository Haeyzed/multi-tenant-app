export type WorldOption = {
  value: string
  label: string
}

export type CountryOption = WorldOption

export type CurrencyOption = WorldOption

export type StateOption = WorldOption

export type CountryCurrency = {
  id: number
  code: string
  name: string
  symbol: string | null
}

export type CountryRef = {
  id: number
  name: string
  iso2: string
}

export type StateRef = {
  id: number
  name: string
}

export type Country = {
  id: number
  name: string
  iso2: string
  iso3: string | null
  status?: number
  phone_code: string | null
  native?: string | null
  region: string | null
  subregion: string | null
  latitude?: string | null
  longitude?: string | null
  emoji: string | null
  emojiU?: string | null
  currency_code?: string | null
  currency?: CountryCurrency | null
}

export type State = {
  id: number
  name: string
  country_id: number
  country_code?: string | null
  state_code?: string | null
  type?: string | null
  latitude?: string | null
  longitude?: string | null
  country?: CountryRef | null
}

export type City = {
  id: number
  name: string
  state_id: number
  country_id: number
  country_code?: string | null
  state_code?: string | null
  latitude?: string | null
  longitude?: string | null
  country?: CountryRef | null
  state?: StateRef | null
}

export type Currency = {
  id: number
  country_id: number | null
  name: string
  code: string
  precision: number | null
  symbol: string | null
  symbol_native?: string | null
  symbol_first?: boolean | null
  decimal_mark?: string | null
  thousands_separator?: string | null
  country?: CountryRef | null
}

export type Timezone = {
  id: number
  name: string
  country_id: number | null
  country?: CountryRef | null
}

export type Language = {
  id: number
  code: string
  name: string
  name_native?: string | null
  dir?: string | null
}

export type WorldPaginatedMeta = {
  current_page: number
  from?: number | null
  last_page: number
  per_page: number
  to?: number | null
  total: number
  path?: string
}

export type WorldPaginated<T> = {
  data: T[]
  meta: WorldPaginatedMeta
}

export type WorldStatistics = {
  countries: number
  states: number
  cities: number
  currencies: number
  timezones: number
  languages: number
  active_countries: number
  inactive_countries: number
}
