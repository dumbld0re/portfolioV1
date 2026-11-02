"use client"

import { useEffect, useRef, useState } from "react"

import { projectsContent } from "@/content/projects"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { ProjectPreview } from "@/components/project-preview"
import { ProjectString } from "@/components/project-string"
import { column, inlineLink, measure, sectionLabel } from "@/lib/styles"
import { cn } from "@/lib/utils"

export function ProjectsSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = projectsContent[language]
  // The card only shows while a project is hovered or focused, and only
  // switches once the string has tied itself to the new title.
  const [hovered, setHovered] = useState<number | null>(null)
  const [shown, setShown] = useState(0)
  const anchors = useRef<(HTMLElement | null)[]>([])
  const lane = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const bind = (i: number) => ({
    "data-project": i,
    onMouseEnter: () => setHovered(i),
    onFocus: () => setHovered(i),
  })

  // When the page scrolls under a still mouse, browsers update hover late (or
  // only on the next move). Re-check what's under the pointer on each scroll
  // frame, so the card follows the list instead of sticking to the old item.
  useEffect(() => {
    let x = -1
    let y = -1
    let frame = 0
    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
    }
    const check = () => {
      frame = 0
      if (x < 0 || !list.current) return
      // Keyboard focus inside the list keeps its own selection.
      if (list.current.contains(document.activeElement)) return
      const item = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-project]")
      const index = item && list.current.contains(item) ? Number(item.dataset.project) : null
      setHovered(index)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  // A spot just past each title where the string's ring ties on.
  const anchor = (i: number) => (
    <span
      ref={(node) => {
        anchors.current[i] = node
      }}
      aria-hidden="true"
      className="ml-4 hidden size-2 align-middle lg:inline-block"
    />
  )
  // While one project is hovered on a wide screen, the rest step back.
  const dim = (i: number) => cn("transition-opacity duration-500", hovered !== null && i !== hovered && "lg:opacity-50")

  return (
    <section id="projects" className="scroll-mt-10 px-6 md:px-12 py-24 md:py-32">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>
          {labels.nav.projects}
        </h2>
        <p className="mt-6 font-serif text-5xl leading-tight tracking-[-0.02em] md:text-7xl">{t.heading}</p>

        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,48rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <ol
          ref={list}
          className={`${measure} space-y-16`}
          onMouseLeave={() => setHovered(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(null)
          }}
        >
          {t.projects.map((project, i) => {
            if (project.comingSoon) {
              return (
                <li key={i} {...bind(i)} className={cn("text-muted-foreground/60", dim(i))}>
                  <span className="font-serif text-3xl lowercase md:text-4xl">
                    {t.comingSoonLabel}
                    <span className="text-primary motion-safe:animate-caret-blink" aria-hidden="true">
                      _
                    </span>
                    {anchor(i)}
                  </span>
                </li>
              )
            }

            return (
              <li key={i} {...bind(i)} className={dim(i)}>
                <div className="space-y-3">
                  <h3 className="font-serif text-3xl leading-snug tracking-[-0.01em] md:text-4xl">
                    {project.title}
                    {anchor(i)}
                  </h3>

                  {(project.status || project.internalTool) && (
                    <p className="flex flex-wrap gap-x-4 font-mono text-sm lowercase">
                      {project.status && <span className="text-primary">● {t.statusLabels[project.status]}</span>}
                      {project.internalTool && <span className="text-muted-foreground">{t.internalToolLabel}</span>}
                    </p>
                  )}

                  {project.tagline && <p className="text-lg text-foreground/85 leading-relaxed">{project.tagline}</p>}
                  <p className="text-lg leading-relaxed text-muted-foreground">{project.description}</p>
                  <p className="font-mono text-sm text-muted-foreground/80">{project.tech.join(" · ")}</p>

                  {(project.demoHref || project.githubHref) && (
                    <p className="flex flex-wrap gap-x-3 pt-1 font-mono text-base text-muted-foreground">
                      {project.demoHref && (
                        <a href={project.demoHref} target="_blank" rel="noreferrer" className={inlineLink}>
                          {(project.demoKind === "site" ? t.viewSiteLabel : t.viewDemoLabel).toLowerCase()} ↗
                        </a>
                      )}
                      {project.demoHref && project.githubHref && (
                        <span className="text-muted-foreground/40" aria-hidden="true">
                          /
                        </span>
                      )}
                      {project.githubHref && (
                        <a href={project.githubHref} target="_blank" rel="noreferrer" className={inlineLink}>
                          {t.viewSourceLabel.toLowerCase()} ↗
                        </a>
                      )}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {/* An empty column on wide screens: the hovered project's card hangs here. */}
        <aside ref={lane} aria-hidden="true" className="hidden lg:block" />
        <ProjectString hovered={hovered} anchors={anchors} lane={lane} onConnect={setShown}>
          <ProjectPreview
            project={t.projects[shown] ?? t.projects[0]}
            folder={labels.nav.projects.toLowerCase()}
            comingSoonLabel={t.comingSoonLabel}
          />
        </ProjectString>
        </div>
      </div>
    </section>
  )
}
