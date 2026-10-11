import type React from "react"
import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"

import { BoringClassSync } from "@/components/boring-toggle"
import { CustomCursor } from "@/components/custom-cursor"
import { LanguageProvider } from "@/components/language-provider"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ThemeColorSync } from "@/components/theme-color-sync"
import { ThemeProvider } from "@/components/theme-provider"
import { fontVariables } from "@/lib/fonts"
import { DEFAULT_LANGUAGE, LANGUAGES, isLanguage, localizePath } from "@/lib/i18n"
import { SITE_NAME, SITE_URL, baseOpenGraph, languageAlternates, shareImages, siteMeta } from "@/lib/seo"
import "../globals.css"

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  const language = isLanguage(lang) ? lang : DEFAULT_LANGUAGE
  const meta = siteMeta[language]

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${meta.tagline}`,
      template: `%s — ${SITE_NAME}`,
    },
    description: meta.description,
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
    alternates: languageAlternates(language, "/"),
    robots: { index: true, follow: true },
    openGraph: {
      ...baseOpenGraph(language),
      title: SITE_NAME,
      description: meta.description,
      url: localizePath(language, "/"),
      type: "website",
    },
    // title/description are left out so each page's own values carry through.
    twitter: { card: "summary_large_image", images: shareImages.twitter },
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
}

// Initial browser-chrome color by OS scheme; ThemeColorSync corrects it to the
// site's chosen theme after hydration. Values mirror --background in globals.css.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#282828" },
  ],
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()

  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      <body className={`${fontVariables} font-sans antialiased`}>
        <LanguageProvider language={lang}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ThemeColorSync />
            <BoringClassSync />
            {children}
            <ScrollReveal />
          </ThemeProvider>
          <Analytics />
        </LanguageProvider>
        <CustomCursor />
      </body>
    </html>
  )
}
