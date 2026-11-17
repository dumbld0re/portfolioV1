import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { ThingsSection } from "@/components/sections/things-section"
import { siteCopy } from "@/content/site"
import { thingsContent } from "@/content/things"
import { DEFAULT_LANGUAGE, isLanguage, localizePath } from "@/lib/i18n"
import { baseOpenGraph, languageAlternates } from "@/lib/seo"

export async function generateMetadata({ params }: PageProps<"/[lang]/things">): Promise<Metadata> {
  const { lang } = await params
  const language = isLanguage(lang) ? lang : DEFAULT_LANGUAGE

  return {
    title: siteCopy[language].nav.things,
    description: thingsContent[language].tagline,
    alternates: languageAlternates(language, "/things"),
    openGraph: { ...baseOpenGraph(language), url: localizePath(language, "/things") },
    // a placeholder for now: kept out of search results and the sitemap
    robots: { index: false, follow: true },
  }
}

export default function Things() {
  return (
    <LayoutWrapper>
      <ThingsSection />
    </LayoutWrapper>
  )
}
