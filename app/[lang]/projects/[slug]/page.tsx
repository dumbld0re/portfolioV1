import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProjectCase } from "@/components/projects/project-case"
import { hasCase, projectPath, projectsContent } from "@/content/projects"
import { PROJECTS_LIVE } from "@/lib/features"
import { DEFAULT_LANGUAGE, isLanguage, localizePath } from "@/lib/i18n"
import { baseOpenGraph, languageAlternates } from "@/lib/seo"

export function generateStaticParams() {
  return projectsContent[DEFAULT_LANGUAGE].projects.filter(hasCase).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params
  const language = isLanguage(lang) ? lang : DEFAULT_LANGUAGE
  const project = projectsContent[language].projects.filter(hasCase).find((p) => p.slug === slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.tagline ?? project.description,
    alternates: languageAlternates(language, projectPath(slug)),
    openGraph: { ...baseOpenGraph(language), url: localizePath(language, projectPath(slug)), title: project.title },
    // unlisted until the projects page goes live (lib/features.ts)
    ...(PROJECTS_LIVE ? {} : { robots: { index: false, follow: false } }),
  }
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { slug } = await params
  if (!projectsContent[DEFAULT_LANGUAGE].projects.filter(hasCase).some((p) => p.slug === slug)) notFound()

  return (
    <LayoutWrapper>
      <ProjectCase slug={slug} />
    </LayoutWrapper>
  )
}
