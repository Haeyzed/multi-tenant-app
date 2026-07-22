"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {Subscription} from "@/types/central/subscription"

export type SubscriptionsDialogType =
    | "create"
    | "view"
    | "cancel"
    | "upgrade"
    | "downgrade"
    | "renew"
    | "pause"
    | "resume"
    | "expire"
    | "past-due"

type SubscriptionsContextType = {
    open: SubscriptionsDialogType | null
    setOpen: (str: SubscriptionsDialogType | null) => void
    currentRow: Subscription | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Subscription | null>>
}

const SubscriptionsContext =
    React.createContext<SubscriptionsContextType | null>(null)

export function SubscriptionsProvider({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<SubscriptionsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Subscription | null>(null)

    return (
        <SubscriptionsContext.Provider
            value={{open, setOpen, currentRow, setCurrentRow}}
        >
            {children}
        </SubscriptionsContext.Provider>
    )
}

export function useSubscriptions() {
    const context = React.useContext(SubscriptionsContext)

    if (!context) {
        throw new Error(
            "useSubscriptions has to be used within <SubscriptionsProvider>"
        )
    }

    return context
}
