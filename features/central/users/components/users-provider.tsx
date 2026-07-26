"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {CentralUser} from "@/features/central/users/types"

export type UsersDialogType =
    | "create"
    | "update"
    | "view"
    | "delete"
    | "activate"
    | "suspend"
    | "assignRoles"
    | "assignPermissions"
    | "deleteMany"
    | "suspendMany"
    | "activateMany"
    | "security"
    | "activities"

export type BulkSelection = {
    ids: number[]
    onComplete?: () => void
}

type UsersContextType = {
    open: UsersDialogType | null
    setOpen: (str: UsersDialogType | null) => void
    currentRow: CentralUser | null
    setCurrentRow: React.Dispatch<React.SetStateAction<CentralUser | null>>
    bulkSelection: BulkSelection | null
    setBulkSelection: React.Dispatch<React.SetStateAction<BulkSelection | null>>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<UsersDialogType>(null)
    const [currentRow, setCurrentRow] = useState<CentralUser | null>(null)
    const [bulkSelection, setBulkSelection] = useState<BulkSelection | null>(null)

    return (
        <UsersContext.Provider
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
                bulkSelection,
                setBulkSelection,
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}

export function useUsers() {
    const context = React.useContext(UsersContext)

    if (!context) {
        throw new Error("useUsers has to be used within <UsersProvider>")
    }

    return context
}
