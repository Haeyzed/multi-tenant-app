import {keepPreviousData} from "@tanstack/react-query"

/**
 * Shared query options for paginated / filterable list endpoints.
 * Keeps prior page visible while the next request loads.
 */
export const listQueryOptions = {
    placeholderData: keepPreviousData,
    staleTime: 30_000,
} as const

/**
 * Shared query options for rarely changing option/catalog endpoints.
 */
export const catalogQueryOptions = {
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
} as const
