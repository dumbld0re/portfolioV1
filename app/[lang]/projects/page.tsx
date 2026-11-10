import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProjectsPage } from "@/components/sections/projects-page"
import { siteCopy } from "@/content/site"
import { DEFAULT_LANGUAGE, isLanguage, localizePath } from "@/lib/i18n"
import { baseOpenGraph, languageAlternates, siteMeta } from "@/lib/seo"

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params
  const language = isLanguage(lang) ? lang : DEFAULT_LANGUAGE

  return {
    title: siteCopy[language].nav.projects,
    description: siteMeta[language].projectsDescription,
    alternates: languageAlternates(language, "/projects"),
    openGraph: { ...baseOpenGraph(language), url: localizePath(language, "/projects") },
  }
}

export default function Projects() {
  return (
    <LayoutWrapper>
      <ProjectsPage />
    </LayoutWrapper>
  )
}
