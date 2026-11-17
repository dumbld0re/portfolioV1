"use client"

import { useEffect, useState } from "react"

import { projectsContent } from "@/content/projects"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { ProjectList } from "@/components/projects/layouts/list"
import { PROJECTS_LIVE } from "@/lib/features"
import { column } from "@/lib/styles"

// /projects, set like /posts: a small serif heading, one muted line under it,
// then the list, each project opening its own page. Until PROJECTS_LIVE,
// visitors see that the page is being reworked; the list shows only with
// ?preview in the URL.
export function ProjectsPage() {
  const { language } = useLanguage()
  const t = projectsContent[language]
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    // Reading the URL after hydration, not deriving state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(new URLSearchParams(location.search).has("preview"))
  }, [])

  return (
    <main className="flex-1 px-6 md:px-12 pt-14 pb-24 md:pt-20 md:pb-32 short:pt-8">
      <div className={column}>
        <div className="max-w-2xl">
          <header>
            <h1 className="font-serif text-4xl lowercase leading-tight tracking-[-0.02em] md:text-5xl">
              {siteCopy[language].nav.projects}
            </h1>
            <p className="mt-3 text-muted-foreground">{PROJECTS_LIVE || preview ? t.tagline : t.updating}</p>
          </header>
          {(PROJECTS_LIVE || preview) && <ProjectList t={t} />}
        </div>
      </div>
    </main>
  )
}
