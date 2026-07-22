import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {
    CityFormValues,
    CountryFormValues,
    CurrencyFormValues,
    LanguageFormValues,
    StateFormValues,
    TimezoneFormValues,
} from "@/features/central/world/schemas"
import {
    createCity,
    createCountry,
    createCurrency,
    createLanguage,
    createState,
    createTimezone,
    deleteCity,
    deleteCountry,
    deleteCurrency,
    deleteLanguage,
    deleteState,
    deleteTimezone,
    getAdminCountryOptions,
    getAdminStateOptions,
    getCountries,
    getCountry,
    getCountryOptions,
    getCountryStates,
    getCurrencies,
    getCurrencyOptions,
    getLanguages,
    getPaginatedCities,
    getPaginatedCountries,
    getPaginatedCurrencies,
    getPaginatedLanguages,
    getPaginatedStates,
    getPaginatedTimezones,
    getStateCities,
    getTimezones,
    getWorldStatistics,
    updateCity,
    updateCountry,
    updateCurrency,
    updateLanguage,
    updateState,
    updateTimezone,
} from "@/lib/services/central/world-service"

export function useCountries(params?: { search?: string; status?: number }) {
    return useQuery({
        queryKey: ["central", "world", "countries", params ?? {}],
        queryFn: () => getCountries(params),
    })
}

export function useCountryOptions(search?: string) {
    return useQuery({
        queryKey: ["central", "world", "country-options", search ?? ""],
        queryFn: () => getCountryOptions(search),
    })
}

export function useCurrencyOptions(search?: string) {
    return useQuery({
        queryKey: ["central", "world", "currency-options", search ?? ""],
        queryFn: () => getCurrencyOptions(search),
        staleTime: 5 * 60 * 1000,
    })
}

export function useCountry(iso2?: string) {
    return useQuery({
        queryKey: ["central", "world", "country", iso2 ?? ""],
        queryFn: () => getCountry(iso2 as string),
        enabled: !!iso2,
    })
}

export function useCountryStates(iso2?: string) {
    return useQuery({
        queryKey: ["central", "world", "states", iso2 ?? ""],
        queryFn: () => getCountryStates(iso2 as string),
        enabled: !!iso2,
    })
}

export function useStateCities(stateId?: number) {
    return useQuery({
        queryKey: ["central", "world", "cities", stateId ?? 0],
        queryFn: () => getStateCities(stateId as number),
        enabled: !!stateId,
    })
}

export function useCurrencies(search?: string) {
    return useQuery({
        queryKey: ["central", "world", "currencies", search ?? ""],
        queryFn: () => getCurrencies(search),
    })
}

export function useTimezones(params?: {
    search?: string
    country_id?: number
}) {
    return useQuery({
        queryKey: ["central", "world", "timezones", params ?? {}],
        queryFn: () => getTimezones(params),
    })
}

export function useLanguages(search?: string) {
    return useQuery({
        queryKey: ["central", "world", "languages", search ?? ""],
        queryFn: () => getLanguages(search),
    })
}

export const worldStatisticsQueryKey = () =>
    ["central", "world", "statistics"] as const

const worldAdminQueryKey = (
    entity: string,
    params?: Record<string, unknown>
) => ["central", "world", "admin", entity, params ?? {}] as const

function useInvalidateWorld(entity: string) {
    const queryClient = useQueryClient()

    return () => {
        queryClient.invalidateQueries({
            queryKey: ["central", "world", "admin", entity],
        })
        queryClient.invalidateQueries({queryKey: worldStatisticsQueryKey()})
    }
}

export function useWorldStatistics() {
    return useQuery({
        queryKey: worldStatisticsQueryKey(),
        queryFn: getWorldStatistics,
    })
}

export function useCountrySelectOptions(search?: string) {
    return useQuery({
        queryKey: worldAdminQueryKey("countries", {options: true, search}),
        queryFn: () => getAdminCountryOptions(search),
        staleTime: 5 * 60 * 1000,
    })
}

export function useStateSelectOptions(countryId?: number, search?: string) {
    return useQuery({
        queryKey: worldAdminQueryKey("states", {
            options: true,
            country_id: countryId ?? 0,
            search,
        }),
        queryFn: () => getAdminStateOptions(countryId as number, search),
        enabled: !!countryId,
        staleTime: 5 * 60 * 1000,
    })
}

export function useGetPaginatedCountries(params?: {
    search?: string
    status?: string
    region?: string
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: worldAdminQueryKey("countries", params),
        queryFn: () => getPaginatedCountries(params),
    })
}

export function useCreateCountry() {
    const invalidate = useInvalidateWorld("countries")
    return useMutation({
        mutationFn: (values: CountryFormValues) => createCountry(values),
        onSuccess: invalidate,
    })
}

export function useUpdateCountry() {
    const invalidate = useInvalidateWorld("countries")
    return useMutation({
        mutationFn: ({id, values}: { id: number; values: CountryFormValues }) =>
            updateCountry(id, values),
        onSuccess: invalidate,
    })
}

export function useDeleteCountry() {
    const invalidate = useInvalidateWorld("countries")
    return useMutation({
        mutationFn: (id: number) => deleteCountry(id),
        onSuccess: invalidate,
    })
}

export function useGetPaginatedStates(params?: {
    search?: string
    country_id?: number
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: worldAdminQueryKey("states", params),
        queryFn: () => getPaginatedStates(params),
    })
}

export function useCreateState() {
    const invalidate = useInvalidateWorld("states")
    return useMutation({
        mutationFn: (values: StateFormValues) => createState(values),
        onSuccess: invalidate,
    })
}

export function useUpdateState() {
    const invalidate = useInvalidateWorld("states")
    return useMutation({
        mutationFn: ({id, values}: { id: number; values: StateFormValues }) =>
            updateState(id, values),
        onSuccess: invalidate,
    })
}

export function useDeleteState() {
    const invalidate = useInvalidateWorld("states")
    return useMutation({
        mutationFn: (id: number) => deleteState(id),
        onSuccess: invalidate,
    })
}

export function useGetPaginatedCities(params?: {
    search?: string
    country_id?: number
    state_id?: number
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: worldAdminQueryKey("cities", params),
        queryFn: () => getPaginatedCities(params),
    })
}

export function useCreateCity() {
    const invalidate = useInvalidateWorld("cities")
    return useMutation({
        mutationFn: (values: CityFormValues) => createCity(values),
        onSuccess: invalidate,
    })
}

export function useUpdateCity() {
    const invalidate = useInvalidateWorld("cities")
    return useMutation({
        mutationFn: ({id, values}: { id: number; values: CityFormValues }) =>
            updateCity(id, values),
        onSuccess: invalidate,
    })
}

export function useDeleteCity() {
    const invalidate = useInvalidateWorld("cities")
    return useMutation({
        mutationFn: (id: number) => deleteCity(id),
        onSuccess: invalidate,
    })
}

export function useGetPaginatedCurrencies(params?: {
    search?: string
    country_id?: number
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: worldAdminQueryKey("currencies", params),
        queryFn: () => getPaginatedCurrencies(params),
    })
}

export function useCreateCurrency() {
    const invalidate = useInvalidateWorld("currencies")
    return useMutation({
        mutationFn: (values: CurrencyFormValues) => createCurrency(values),
        onSuccess: invalidate,
    })
}

export function useUpdateCurrency() {
    const invalidate = useInvalidateWorld("currencies")
    return useMutation({
        mutationFn: ({id, values}: { id: number; values: CurrencyFormValues }) =>
            updateCurrency(id, values),
        onSuccess: invalidate,
    })
}

export function useDeleteCurrency() {
    const invalidate = useInvalidateWorld("currencies")
    return useMutation({
        mutationFn: (id: number) => deleteCurrency(id),
        onSuccess: invalidate,
    })
}

export function useGetPaginatedTimezones(params?: {
    search?: string
    country_id?: number
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: worldAdminQueryKey("timezones", params),
        queryFn: () => getPaginatedTimezones(params),
    })
}

export function useCreateTimezone() {
    const invalidate = useInvalidateWorld("timezones")
    return useMutation({
        mutationFn: (values: TimezoneFormValues) => createTimezone(values),
        onSuccess: invalidate,
    })
}

export function useUpdateTimezone() {
    const invalidate = useInvalidateWorld("timezones")
    return useMutation({
        mutationFn: ({id, values}: { id: number; values: TimezoneFormValues }) =>
            updateTimezone(id, values),
        onSuccess: invalidate,
    })
}

export function useDeleteTimezone() {
    const invalidate = useInvalidateWorld("timezones")
    return useMutation({
        mutationFn: (id: number) => deleteTimezone(id),
        onSuccess: invalidate,
    })
}

export function useGetPaginatedLanguages(params?: {
    search?: string
    dir?: string
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: worldAdminQueryKey("languages", params),
        queryFn: () => getPaginatedLanguages(params),
    })
}

export function useCreateLanguage() {
    const invalidate = useInvalidateWorld("languages")
    return useMutation({
        mutationFn: (values: LanguageFormValues) => createLanguage(values),
        onSuccess: invalidate,
    })
}

export function useUpdateLanguage() {
    const invalidate = useInvalidateWorld("languages")
    return useMutation({
        mutationFn: ({id, values}: { id: number; values: LanguageFormValues }) =>
            updateLanguage(id, values),
        onSuccess: invalidate,
    })
}

export function useDeleteLanguage() {
    const invalidate = useInvalidateWorld("languages")
    return useMutation({
        mutationFn: (id: number) => deleteLanguage(id),
        onSuccess: invalidate,
    })
}
