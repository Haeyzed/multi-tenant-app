import {
  type ApiEnvelope,
  centralApiClient,
} from "@/lib/api/central-client"
import type {
  CityFormValues,
  CountryFormValues,
  CurrencyFormValues,
  LanguageFormValues,
  StateFormValues,
  TimezoneFormValues,
} from "@/features/central/world/schemas"
import type {
  City,
  Country,
  CountryOption,
  Currency,
  CurrencyOption,
  Language,
  State,
  StateOption,
  Timezone,
  WorldPaginated,
  WorldPaginatedMeta,
  WorldStatistics,
} from "@/types/central/world"

export async function getCountries(params?: {
  search?: string
  status?: number
}): Promise<Country[]> {
  const response = await centralApiClient.get<ApiEnvelope<Country[]>>(
    "/world/countries",
    params
  )
  return response.data
}

export async function getCountryOptions(
  search?: string
): Promise<CountryOption[]> {
  const response = await centralApiClient.get<ApiEnvelope<CountryOption[]>>(
    "/world/countries/options",
    search ? { search } : undefined
  )
  return response.data
}

export async function getCountry(iso2: string): Promise<Country> {
  const response = await centralApiClient.get<ApiEnvelope<Country>>(
    `/world/countries/${iso2}`
  )
  return response.data
}

export async function getCountryStates(iso2: string): Promise<State[]> {
  const response = await centralApiClient.get<ApiEnvelope<State[]>>(
    `/world/countries/${iso2}/states`
  )
  return response.data
}

export async function getStateCities(stateId: number): Promise<City[]> {
  const response = await centralApiClient.get<ApiEnvelope<City[]>>(
    `/world/states/${stateId}/cities`
  )
  return response.data
}

export async function getCurrencies(search?: string): Promise<Currency[]> {
  const response = await centralApiClient.get<ApiEnvelope<Currency[]>>(
    "/world/currencies",
    search ? { search } : undefined
  )
  return response.data
}

export async function getCurrencyOptions(
  search?: string
): Promise<CurrencyOption[]> {
  const response = await centralApiClient.get<ApiEnvelope<CurrencyOption[]>>(
    "/world/currencies/options",
    search ? { search } : undefined
  )
  return response.data
}

export async function getTimezones(params?: {
  search?: string
  country_id?: number
}): Promise<Timezone[]> {
  const response = await centralApiClient.get<ApiEnvelope<Timezone[]>>(
    "/world/timezones",
    params
  )
  return response.data
}

export async function getLanguages(search?: string): Promise<Language[]> {
  const response = await centralApiClient.get<ApiEnvelope<Language[]>>(
    "/world/languages",
    search ? { search } : undefined
  )
  return response.data
}

async function getPaginated<T>(
  path: string,
  params?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<WorldPaginated<T>> {
  const response = await centralApiClient.get<
    ApiEnvelope<T[]> & { meta?: WorldPaginatedMeta }
  >(path, params, { signal })

  return {
    data: response.data,
    meta: (response.meta as WorldPaginatedMeta) || {
      current_page: 1,
      last_page: 1,
      per_page: Number(params?.per_page) || 15,
      total: response.data.length,
    },
  }
}

export async function getWorldStatistics(): Promise<WorldStatistics> {
  const response = await centralApiClient.get<ApiEnvelope<WorldStatistics>>(
    "/world/statistics"
  )
  return response.data
}

function countryToPayload(values: CountryFormValues) {
  return {
    name: values.name,
    iso2: values.iso2.toUpperCase(),
    iso3: values.iso3 ? values.iso3.toUpperCase() : null,
    status: Number(values.status),
    phone_code: values.phone_code || null,
    native: values.native || null,
    region: values.region || null,
    subregion: values.subregion || null,
    emoji: values.emoji || null,
  }
}

export async function getPaginatedCountries(
  params?: {
    search?: string
    status?: string
    region?: string
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<WorldPaginated<Country>> {
  return getPaginated<Country>("/world/admin/countries", params, signal)
}

export async function getAdminCountryOptions(
  search?: string
): Promise<CountryOption[]> {
  const response = await centralApiClient.get<ApiEnvelope<CountryOption[]>>(
    "/world/admin/countries/options",
    search ? { search } : undefined
  )
  return response.data
}

export async function createCountry(values: CountryFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<Country>>(
    "/world/admin/countries",
    countryToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateCountry(id: number, values: CountryFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<Country>>(
    `/world/admin/countries/${id}`,
    countryToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteCountry(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/world/admin/countries/${id}`
  )
  return { data: null, message: response.message }
}

function stateToPayload(values: StateFormValues) {
  return {
    country_id: Number(values.country_id),
    name: values.name,
    state_code: values.state_code || null,
    country_code: values.country_code || null,
    type: values.type || null,
  }
}

export async function getPaginatedStates(
  params?: {
    search?: string
    country_id?: number
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<WorldPaginated<State>> {
  return getPaginated<State>("/world/admin/states", params, signal)
}

export async function getAdminStateOptions(
  countryId: number,
  search?: string
): Promise<StateOption[]> {
  const response = await centralApiClient.get<ApiEnvelope<StateOption[]>>(
    "/world/admin/states/options",
    { country_id: countryId, ...(search ? { search } : {}) }
  )
  return response.data
}

export async function createState(values: StateFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<State>>(
    "/world/admin/states",
    stateToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateState(id: number, values: StateFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<State>>(
    `/world/admin/states/${id}`,
    stateToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteState(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/world/admin/states/${id}`
  )
  return { data: null, message: response.message }
}

function cityToPayload(values: CityFormValues) {
  return {
    country_id: Number(values.country_id),
    state_id: Number(values.state_id),
    name: values.name,
    country_code: values.country_code.toUpperCase(),
    state_code: values.state_code.toUpperCase(),
  }
}

export async function getPaginatedCities(
  params?: {
    search?: string
    country_id?: number
    state_id?: number
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<WorldPaginated<City>> {
  return getPaginated<City>("/world/admin/cities", params, signal)
}

export async function createCity(values: CityFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<City>>(
    "/world/admin/cities",
    cityToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateCity(id: number, values: CityFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<City>>(
    `/world/admin/cities/${id}`,
    cityToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteCity(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/world/admin/cities/${id}`
  )
  return { data: null, message: response.message }
}

function currencyToPayload(values: CurrencyFormValues) {
  return {
    country_id: Number(values.country_id),
    name: values.name,
    code: values.code.toUpperCase(),
    symbol: values.symbol,
    symbol_native: values.symbol_native || null,
    precision: values.precision ? Number(values.precision) : undefined,
  }
}

export async function getPaginatedCurrencies(
  params?: {
    search?: string
    country_id?: number
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<WorldPaginated<Currency>> {
  return getPaginated<Currency>("/world/admin/currencies", params, signal)
}

export async function createCurrency(values: CurrencyFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<Currency>>(
    "/world/admin/currencies",
    currencyToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateCurrency(id: number, values: CurrencyFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<Currency>>(
    `/world/admin/currencies/${id}`,
    currencyToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteCurrency(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/world/admin/currencies/${id}`
  )
  return { data: null, message: response.message }
}

function timezoneToPayload(values: TimezoneFormValues) {
  return {
    country_id: Number(values.country_id),
    name: values.name,
  }
}

export async function getPaginatedTimezones(
  params?: {
    search?: string
    country_id?: number
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<WorldPaginated<Timezone>> {
  return getPaginated<Timezone>("/world/admin/timezones", params, signal)
}

export async function createTimezone(values: TimezoneFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<Timezone>>(
    "/world/admin/timezones",
    timezoneToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateTimezone(id: number, values: TimezoneFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<Timezone>>(
    `/world/admin/timezones/${id}`,
    timezoneToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteTimezone(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/world/admin/timezones/${id}`
  )
  return { data: null, message: response.message }
}

function languageToPayload(values: LanguageFormValues) {
  return {
    code: values.code.toLowerCase(),
    name: values.name,
    name_native: values.name_native,
    dir: values.dir,
  }
}

export async function getPaginatedLanguages(
  params?: {
    search?: string
    dir?: string
    per_page?: number
    page?: number
  },
  signal?: AbortSignal
): Promise<WorldPaginated<Language>> {
  return getPaginated<Language>("/world/admin/languages", params, signal)
}

export async function createLanguage(values: LanguageFormValues) {
  const response = await centralApiClient.post<ApiEnvelope<Language>>(
    "/world/admin/languages",
    languageToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function updateLanguage(id: number, values: LanguageFormValues) {
  const response = await centralApiClient.put<ApiEnvelope<Language>>(
    `/world/admin/languages/${id}`,
    languageToPayload(values)
  )
  return { data: response.data, message: response.message }
}

export async function deleteLanguage(id: number) {
  const response = await centralApiClient.delete<ApiEnvelope<null>>(
    `/world/admin/languages/${id}`
  )
  return { data: null, message: response.message }
}
