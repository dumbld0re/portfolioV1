"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { projectsContent } from "@/content/projects"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { ProjectPreview, type Room } from "@/components/project-preview"
import { column, inlineLink, measure, sectionLabel } from "@/lib/styles"
import { cn } from "@/lib/utils"

/** Where the sticky cards sit (top-24), the gap kept above the screen's bottom edge, and the column's cap (max-w-[32rem]). */
const CARD_TOP = 96
const CARD_EDGE = 24
const CARD_MAX = 512

export function ProjectsSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = projectsContent[language]
  // The card shows while a project is hovered or focused. `shown` keeps the
  // last one, so the card still has something in it while it fades out.
  const [hovered, setHovered] = useState<number | null>(null)
  const [shown, setShown] = useState(0)
  const list = useRef<HTMLOListElement>(null)
  const lane = useRef<HTMLElement>(null)
  // The space the cards have right now: from their sticky top down to the
  // screen's bottom or the end of the list, whichever comes first. Scrolled
  // far down, there's only room for one card; with space, a second joins.
  const [room, setRoom] = useState<Room | null>(null)
  const measureRoom = useCallback(() => {
    const box = lane.current?.getBoundingClientRect()
    if (!box) return
    const width = Math.min(box.width, CARD_MAX)
    // Rounded, so scrolling only re-renders when the space really changes.
    const height = Math.round((Math.min(window.innerHeight - CARD_EDGE, box.bottom) - Math.max(CARD_TOP, box.top)) / 8) * 8
    setRoom((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }))
  }, [])
  const select = (i: number | null) => {
    setHovered(i)
    if (i !== null) setShown(i)
    measureRoom()
  }
  const bind = (i: number) => ({
    "data-project": i,
    onMouseEnter: () => select(i),
    onFocus: () => select(i),
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
      measureRoom()
      if (x < 0 || !list.current) return
      // Keyboard focus inside the list keeps its own selection.
      if (list.current.contains(document.activeElement)) return
      const item = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-project]")
      const index = item && list.current.contains(item) ? Number(item.dataset.project) : null
      setHovered(index)
      if (index !== null) setShown(index)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [measureRoom])

  // While one project is hovered on a wide screen, the rest step back.
  const dim = (i: number) => cn("transition-opacity duration-500", hovered !== null && i !== hovered && "lg:opacity-50")

  return (
    <section id="projects" className="scroll-mt-10 px-6 md:px-12 py-24 md:py-32">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>{labels.nav.projects}</h2>
        <p className="mt-6 font-serif text-5xl lowercase leading-tight tracking-[-0.02em] md:text-7xl">
          {t.heading}
          <span className="text-primary">.</span>
        </p>

        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,48rem)_minmax(18rem,1fr)] lg:gap-16 xl:gap-24">
          <ol
            ref={list}
            className={`${measure} space-y-16`}
            onMouseLeave={() => setHovered(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(null)
            }}
          >
            {t.projects.map((project, i) => (
              <li key={project.slug ?? i} {...bind(i)} className={cn("space-y-3", dim(i))}>
                <h3 className="font-serif text-3xl leading-snug tracking-[-0.01em] md:text-4xl">{project.title}</h3>

                {(project.status || project.internalTool) && (
                  <p className="flex flex-wrap gap-x-4 font-mono text-sm lowercase">
                    {project.status && <span className="text-primary">● {t.statusLabels[project.status]}</span>}
                    {project.internalTool && <span className="text-muted-foreground">{t.internalToolLabel}</span>}
                  </p>
                )}

                {project.tagline && <p className="text-lg text-foreground/85 leading-relaxed">{project.tagline}</p>}
                <p className="text-lg leading-relaxed text-muted-foreground">{project.description}</p>
                <p className="font-mono text-sm text-muted-foreground/80">{project.tech.join(" · ")}</p>

                {/* Phones, tablets and touch screens have no hover card, so the
                    screens sit right in the list. */}
                <div className="max-w-md pt-3 pb-1 [@media(min-width:1024px)_and_(hover:hover)]:hidden">
                  <ProjectPreview project={project} folder={labels.nav.projects.toLowerCase()} room={null} />
                </div>

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
              </li>
            ))}
          </ol>

          {/* Wide screens with a mouse: the hovered project's card, pinned in
              the free column. It rises in softly and fades between projects
              (just fades with motion paused or reduced). */}
          <aside ref={lane} aria-hidden="true" className="hidden lg:block">
            <div
              className={cn(
                "pointer-events-none sticky top-24 hidden max-w-[32rem] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:block",
                hovered === null ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100",
                "motion-reduce:translate-y-0 [html.paused_&]:translate-y-0",
              )}
            >
              <div key={shown} className="motion-safe:animate-page-fade">
                <ProjectPreview project={t.projects[shown]} folder={labels.nav.projects.toLowerCase()} room={room} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
