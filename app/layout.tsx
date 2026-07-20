import { Geist_Mono, Nunito_Sans } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/lib/providers/query-provider"
import { cn } from "@/lib/utils"
import {NavigationProgress} from "@/components/navigation-progress";

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        nunitoSans.variable
      )}
    >
      <body>
        <NavigationProgress />
        <ThemeProvider>
          <NuqsAdapter>
            <QueryProvider>
              <TooltipProvider>
                {children}
                <Toaster richColors position="top-center" />
              </TooltipProvider>
            </QueryProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
