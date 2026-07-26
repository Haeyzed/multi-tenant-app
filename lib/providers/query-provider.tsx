"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import dynamic from "next/dynamic"
import {useState} from "react"

const ReactQueryDevtools = dynamic(
    () =>
        import("@tanstack/react-query-devtools").then((mod) => mod.ReactQueryDevtools),
    {ssr: false}
)

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                gcTime: 5 * 60_000,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                retry: (failureCount, error) => {
                    const status =
                        typeof error === "object" &&
                        error !== null &&
                        "status" in error &&
                        typeof (error as {status?: unknown}).status === "number"
                            ? (error as {status: number}).status
                            : undefined

                    if (status !== undefined && status >= 400 && status < 500) {
                        return false
                    }

                    return failureCount < 2
                },
            },
            mutations: {
                retry: 0,
            },
        },
    })
}

export function QueryProvider({children}: { children: React.ReactNode }) {
    const [queryClient] = useState(makeQueryClient)

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === "development" ? (
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left"/>
            ) : null}
        </QueryClientProvider>
    )
}
