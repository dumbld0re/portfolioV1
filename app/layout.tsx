import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { LanguageProvider } from "@/components/language-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage } from "@/lib/i18n"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Danny-Miguel Mittelberger - Frontend Developer",
  description: "Freelance Frontend Developer & Linux Enthusiast from Windhoek, Namibia",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE)?.value ?? cookieStore.get("lang")?.value
  const defaultLanguage = isLanguage(cookieLanguage) ? cookieLanguage : DEFAULT_LANGUAGE

  return (
    <html lang={defaultLanguage} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <LanguageProvider defaultLanguage={defaultLanguage}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
