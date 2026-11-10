"use client"

import { projectsContent } from "@/content/projects"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { column, sectionLabel } from "@/lib/styles"

// /projects, linked from the top bar. For now it only says the page is being
// reworked; the project views themselves (ProjectsSection, with its index and
// stage) are ready in components/sections/projects-section.tsx and go back in
// here when the content is.
export function ProjectsPage() {
  const { language } = useLanguage()
  const t = projectsContent[language]

  return (
    <main className="flex-1 px-6 md:px-12 py-24 md:py-32">
      <div className={column}>
        <h1 className={sectionLabel}>{siteCopy[language].nav.projects}</h1>
        <p className="mt-6 font-serif text-5xl lowercase leading-tight tracking-[-0.02em] md:text-7xl">
          {t.heading}
          <span className="text-primary">.</span>
        </p>
        <p className="mt-14 max-w-[40rem] font-serif text-2xl leading-[1.4] tracking-[-0.01em] text-muted-foreground text-balance md:text-3xl">
          {t.updating}
        </p>
      </div>
    </main>
  )
}
