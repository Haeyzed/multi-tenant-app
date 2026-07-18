"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { getCookie, removeCookie, setCookie } from "@/lib/cookies"

export type Direction = "ltr" | "rtl"

const DEFAULT_DIRECTION = "ltr"
const DIRECTION_COOKIE_NAME = "dir"
const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type DirectionContextType = {
  defaultDir: Direction
  dir: Direction
  setDir: (dir: Direction) => void
  resetDir: () => void
}

const DirectionContext = createContext<DirectionContextType | null>(null)

function readStoredDirection(): Direction {
  const saved = getCookie(DIRECTION_COOKIE_NAME)
  return saved === "rtl" || saved === "ltr" ? saved : DEFAULT_DIRECTION
}

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [dir, _setDir] = useState<Direction>(readStoredDirection)

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir)
  }, [dir])

  useEffect(() => {
    const saved = getCookie(DIRECTION_COOKIE_NAME)
    if (saved != null && saved !== "ltr" && saved !== "rtl") {
      removeCookie(DIRECTION_COOKIE_NAME)
    }
  }, [])

  const setDir = (next: Direction) => {
    _setDir(next)
    setCookie(DIRECTION_COOKIE_NAME, next, DIRECTION_COOKIE_MAX_AGE)
  }

  const resetDir = () => {
    _setDir(DEFAULT_DIRECTION)
    removeCookie(DIRECTION_COOKIE_NAME)
  }

  return (
    <DirectionContext.Provider
      value={{
        defaultDir: DEFAULT_DIRECTION,
        dir,
        setDir,
        resetDir,
      }}
    >
      {children}
    </DirectionContext.Provider>
  )
}

export function useDirection() {
  const context = useContext(DirectionContext)
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider")
  }
  return context
}
