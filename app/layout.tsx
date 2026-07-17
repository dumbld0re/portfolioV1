import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Fraunces, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { CustomCursor } from "@/components/custom-cursor"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage } from "@/lib/i18n"
import "./globals.css"

// Two typefaces, one system: Fraunces (an expressive old-style serif) carries
// every editorial/reading surface, Geist Mono every terminal/UI surface.
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://dannymiguel.com"),
  title: "danny-miguel",
  description:
    "Developer and quantitative finance student in Windhoek, Namibia — building fast, clean web interfaces with a soft spot for Linux and the terminal.",
  openGraph: {
    title: "danny-miguel",
    description:
      "Developer and quantitative finance student in Windhoek, Namibia — building fast, clean web interfaces with a soft spot for Linux and the terminal.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "danny-miguel",
    description: "Developer and quantitative finance student in Windhoek, Namibia.",
  },
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
    <html lang={defaultLanguage} suppressHydrationWarning className="scroll-smooth">
      <body className={`${fraunces.variable} ${geistMono.variable} font-serif antialiased`}>
        <LanguageProvider defaultLanguage={defaultLanguage}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Analytics />
        </LanguageProvider>
        <CustomCursor />
      </body>
    </html>
  )
}
