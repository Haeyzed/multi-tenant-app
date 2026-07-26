"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {Country} from "@/features/central/world/types"

export type CountriesDialogType = "create" | "update" | "view" | "delete"

type CountriesContextType = {
    open: CountriesDialogType | null
    setOpen: (str: CountriesDialogType | null) => void
    currentRow: Country | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Country | null>>
}

const CountriesContext = React.createContext<CountriesContextType | null>(null)

export function CountriesProvider({
                                      children,
                                  }: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<CountriesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Country | null>(null)

    return (
        <CountriesContext.Provider
            value={{open, setOpen, currentRow, setCurrentRow}}
        >
            {children}
        </CountriesContext.Provider>
    )
}

export function useCountries() {
    const context = React.useContext(CountriesContext)

    if (!context) {
        throw new Error("useCountries has to be used within <CountriesProvider>")
    }

    return context
}
