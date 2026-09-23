import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { CvSection } from "@/components/sections/cv-section"
import { siteCopy } from "@/content/site"
import { DEFAULT_LANGUAGE, isLanguage, localizePath } from "@/lib/i18n"
import { baseOpenGraph, languageAlternates, siteMeta } from "@/lib/seo"

export async function generateMetadata({ params }: PageProps<"/[lang]/cv">): Promise<Metadata> {
  const { lang } = await params
  const language = isLanguage(lang) ? lang : DEFAULT_LANGUAGE

  return {
    title: siteCopy[language].nav.cv,
    description: siteMeta[language].cvDescription,
    alternates: languageAlternates(language, "/cv"),
    openGraph: { ...baseOpenGraph(language), url: localizePath(language, "/cv") },
  }
}

export default function CvPage() {
  return (
    <LayoutWrapper>
      <CvSection />
    </LayoutWrapper>
  )
}
