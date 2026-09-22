import type React from "react"
import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import localFont from "next/font/local"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { CustomCursor } from "@/components/custom-cursor"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeColorSync } from "@/components/theme-color-sync"
import { ThemeProvider } from "@/components/theme-provider"
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage } from "@/lib/i18n"
import { SITE_NAME, SITE_URL } from "@/lib/seo"
import "./globals.css"

// The type system: Gambarino (an expressive display serif) for headlines,
// Cabinet Grotesk (a variable grotesque) for body and UI, and Geist Mono for
// the terminal chrome — file paths, tags, the email.
const gambarino = localFont({
  src: "./fonts/Gambarino-Regular.woff2",
  variable: "--font-gambarino",
  weight: "400",
  display: "swap",
})
const cabinet = localFont({
  src: "./fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-cabinet",
  weight: "100 900",
  display: "swap",
})
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

const SITE_DESCRIPTION =
  "Developer and quantitative finance student in Windhoek, Namibia — building fast, clean web interfaces with a soft spot for Linux and the terminal."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Developer in Windhoek, Namibia`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: [
    "Danny-Miguel Mittelberger",
    "web developer",
    "freelance developer",
    "Windhoek",
    "Namibia",
    "Next.js",
    "React",
    "quantitative finance",
    "UNAM",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  // title/description are left out so each page's own values carry through.
  twitter: { card: "summary_large_image" },
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

// Initial browser-chrome color by OS scheme; ThemeColorSync corrects it to the
// site's chosen theme after hydration. Values mirror --background in globals.css.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#282828" },
  ],
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
      <body className={`${gambarino.variable} ${cabinet.variable} ${geistMono.variable} font-sans antialiased`}>
        <LanguageProvider defaultLanguage={defaultLanguage}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ThemeColorSync />
            {children}
          </ThemeProvider>
          <Analytics />
        </LanguageProvider>
        <CustomCursor />
      </body>
    </html>
  )
}
