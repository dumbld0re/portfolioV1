import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"

import { BoringClassSync } from "@/components/boring-toggle"
import { CustomCursor } from "@/components/custom-cursor"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ThemeColorSync } from "@/components/theme-color-sync"
import { ThemeProvider } from "@/components/theme-provider"
import { libraryCopy } from "@/content/library-topics"
import { fontVariables } from "@/lib/fonts"
import { LIBRARY_URL } from "@/lib/library-host"
import { SITE_NAME, SITE_URL } from "@/lib/seo"
import "../globals.css"

// Rendered from the ledger's look; regenerate by hand if the design changes.
const SHARE_IMAGE = {
  url: "/library-og.png",
  width: 1200,
  height: 630,
  alt: "read_ — Danny-Miguel's reading index: essays, papers and books",
}

// A second root layout: the library is served from read.dannymiguel.com
// (proxy.ts rewrites it to /library), English-only, and without the
// portfolio's header and language handling.
export const metadata: Metadata = {
  metadataBase: new URL(LIBRARY_URL),
  title: {
    default: `${libraryCopy.title} — ${SITE_NAME}`,
    template: `%s — ${libraryCopy.title}`,
  },
  description: libraryCopy.description,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: libraryCopy.title,
    description: libraryCopy.description,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [SHARE_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [SHARE_IMAGE] },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

// Mirrors app/[lang]/layout.tsx; ThemeColorSync corrects it after hydration.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#282828" },
  ],
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${fontVariables} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ThemeColorSync />
          <BoringClassSync />
          {children}
          <ScrollReveal />
        </ThemeProvider>
        <Analytics />
        <CustomCursor />
      </body>
    </html>
  )
}
