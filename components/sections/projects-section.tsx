"use client"

import { useEffect, useState } from "react"

import { projectsContent, type ProjectsView } from "@/content/projects"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { ProjectIndex } from "@/components/projects/project-index"
import { ProjectStage } from "@/components/projects/project-stage"
import { column, sectionLabel } from "@/lib/styles"
import { useMediaQuery } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

const VIEW_KEY = "projects-view"
const VIEWS: ProjectsView[] = ["index", "stage"]

export function ProjectsSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = projectsContent[language]
  // The index needs a pointer to follow and room for its two columns, so it
  // (and the choice between the views) is only for wide screens with a mouse.
  // There it is what new visitors see first; everyone else gets the stage.
  const canChoose = useMediaQuery("(min-width: 1024px) and (hover: hover)")
  const [chosen, setChosen] = useState<ProjectsView>("index")
  const view = canChoose ? chosen : "stage"

  useEffect(() => {
    try {
      // Restoring a stored preference after hydration, not deriving state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(VIEW_KEY) === "stage") setChosen("stage")
    } catch {}
  }, [])

  const choose = (next: ProjectsView) => {
    setChosen(next)
    try {
      localStorage.setItem(VIEW_KEY, next)
    } catch {}
  }

  return (
    <section id="projects" className="scroll-mt-10 px-6 md:px-12 py-24 md:py-32">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>{labels.nav.projects}</h2>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-12 gap-y-4">
          <p className="font-serif text-5xl lowercase leading-tight tracking-[-0.02em] md:text-7xl">
            {t.heading}
            <span className="text-primary">.</span>
          </p>
          {canChoose && (
            <p className="flex gap-x-2 font-mono text-sm lowercase text-muted-foreground">
              {t.viewLabel}:
              {VIEWS.map((option, i) => (
                <span key={option} className="flex gap-x-2">
                  {i > 0 && (
                    <span className="text-muted-foreground/40" aria-hidden="true">
                      /
                    </span>
                  )}
                  <button
                    type="button"
                    aria-pressed={view === option}
                    onClick={() => choose(option)}
                    className={cn("transition-colors hover:text-foreground", view === option && "text-primary")}
                  >
                    {t.views[option]}
                  </button>
                </span>
              ))}
            </p>
          )}
        </div>

        {view === "index" ? <ProjectIndex t={t} /> : <ProjectStage t={t} />}
      </div>
    </section>
  )
}
