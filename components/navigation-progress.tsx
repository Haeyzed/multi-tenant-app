"use client"

import * as React from "react"
import NextTopLoader from "nextjs-toploader"

export function NavigationProgress() {
    return (
        <NextTopLoader
            /* Use hsl(var(--muted-foreground)) if your globals.css uses HSL variables */
            color="var(--muted-foreground)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={2}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px var(--muted-foreground),0 0 5px var(--muted-foreground)"
        />
    )
}