"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"

import { hasCase, projectPath, projectShots, projectsContent, type Screen } from "@/content/projects"
import { useLanguage } from "@/components/language-provider"
import { ProjectLinks } from "@/components/projects/project-meta"
import { ProjectMorph } from "@/components/projects/morph"
import { alt, ease } from "@/components/projects/layouts/shared"
import { Shot, Window } from "@/components/project-preview"
import { PROJECTS_LIVE } from "@/lib/features"
import { localizePath } from "@/lib/i18n"
import { column } from "@/lib/styles"
import { getLenis } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const isTall = (s: Screen) => s.height > s.width

// A bar widget's own panel: no window frame, at half its pixel size (it was taken at 2x).
function Bare({ screen, alt }: { screen: Screen; alt: string }) {
  return (
    <div style={{ maxWidth: screen.width / 2 }}>
      <Shot screen={screen} alt={alt} eager />
    </div>
  )
}

// Rises into place the first time it scrolls into view.
function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,translate] duration-1000 motion-reduce:transition-none",
        ease,
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  )
}

// A project's own page: its picture (morphed in from the list) as the hero,
// what it is, every capture large, and the next project to carry on to.
export function ProjectCase({ slug }: { slug: string }) {
  const { language } = useLanguage()
  const t = projectsContent[language]

  // Opening a project (also from "next project" at the bottom of another) starts at
  // the top. It runs before paint, so the title morph lands on the new heading.
  // Lenis keeps its own scroll position, so it's reset too, or it glides back down.
  useLayoutEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }, [slug])
  // Demo-only projects have no page, so the "next project" chain skips them.
  const cases = t.projects.filter(hasCase)
  const index = cases.findIndex((p) => p.slug === slug)
  if (index < 0) return null

  const project = cases[index]
  const next = cases[(index + 1) % cases.length]
  const shots = projectShots(project)
  const hero = shots.find((s) => !isTall(s))
  // With no wide hero, the preview's phone pair stays on the projects list only:
  // the page opens on the description and shows the gallery phones below.
  const inHero = hero || project.preview.kind !== "screens" ? [] : project.preview.screens.slice(0, 2)
  const more = shots.filter((s) => s !== hero && !inHero.some((h) => h.src === s.src))
  // a bare capture (a widget, or Remote's laptop-and-phone shot) leads the page beside the description
  const lead = hero ?? inHero.find((s) => s.bare)
  const wide = more.filter((s) => !isTall(s))
  const phones = more.filter(isTall)

  const back = localizePath(language, "/projects") + (PROJECTS_LIVE ? "" : "?preview")
  const nextHref = next.slug ? localizePath(language, projectPath(next.slug)) : back

  return (
    <main className="flex-1 px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28">
      <div className={column}>

        <header className="grid gap-x-16 gap-y-6 lg:grid-cols-12 lg:items-end">
          {/* the title clicked on the list lands here */}
          <h1 className="font-serif text-[min(3rem,11.5vw)] leading-[1] tracking-[-0.03em] text-balance md:text-7xl lg:col-span-7 lg:text-8xl">
            <ProjectMorph slug={project.slug}>
              <span className="inline-block">
                {project.title}
                <span className="text-primary">.</span>
              </span>
            </ProjectMorph>
          </h1>
          <div className="space-y-5 lg:col-span-5 lg:pb-2">
            <ProjectLinks project={project} t={t} />
          </div>
        </header>

        {/* every project starts with why I made it */}
        {project.why && (
          <section className="mt-14 grid gap-y-3 border-t border-border/70 pt-8 md:mt-20 md:grid-cols-12 md:pt-10">
            <h2 className="font-mono text-sm lowercase text-muted-foreground md:col-span-3">{t.whyLabel}</h2>
            <p className="font-serif text-xl leading-[1.45] tracking-[-0.01em] text-foreground/90 text-pretty md:col-span-9 md:text-2xl">
              {project.why}
            </p>
          </section>
        )}

        {lead?.bare ? (
          // a small widget: the description sits beside it instead of below
          <div className="mt-14 grid items-center gap-x-16 gap-y-10 md:mt-20 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Bare screen={lead} alt={alt(project, lead.name)} />
            </div>
            <p className="font-serif text-2xl leading-[1.4] tracking-[-0.01em] text-muted-foreground text-pretty lg:col-span-7 md:text-3xl">
              {project.description}
            </p>
          </div>
        ) : (
          <>
            {hero && (
              <div className="mt-14 md:mt-20">
                <Window className="w-full rounded-lg md:rounded-xl">
                  <Shot screen={hero} alt={alt(project, hero.name)} eager />
                </Window>
              </div>
            )}

            <Reveal className="mt-20 grid gap-y-4 md:mt-28 md:grid-cols-12">
              <p className="font-serif text-2xl leading-[1.4] tracking-[-0.01em] text-muted-foreground text-pretty md:col-span-9 md:col-start-4 md:text-3xl">
                {project.description}
              </p>
            </Reveal>
          </>
        )}

        {wide.length > 0 && (
          <div className="mt-20 space-y-8 md:mt-28 md:space-y-14">
            {wide.map((screen) => (
              <Reveal key={screen.src}>
                {screen.bare ? (
                  <Bare screen={screen} alt={alt(project, screen.name)} />
                ) : (
                  <Window className="w-full rounded-lg md:rounded-xl">
                    <Shot screen={screen} alt={alt(project, screen.name)} eager />
                  </Window>
                )}
              </Reveal>
            ))}
          </div>
        )}

        {phones.length > 0 && (
          <div className="mx-auto mt-14 grid max-w-[64rem] grid-cols-3 gap-3 sm:gap-5 md:mt-20 md:gap-10">
            {phones.map((screen, i) => (
              <Reveal key={screen.src} delay={i * 90} className={cn(i % 3 === 1 && "mt-8 sm:mt-16")}>
                {screen.bare ? (
                  // already in its own device frame
                  <Shot screen={screen} alt={alt(project, screen.name)} eager />
                ) : (
                  <Window className="rounded-xl md:rounded-2xl">
                    <Shot screen={screen} alt={alt(project, screen.name)} eager />
                  </Window>
                )}
              </Reveal>
            ))}
          </div>
        )}

        {/* Onward, as words only: its picture waits on its own page. */}
        {next.slug !== project.slug && (
          <Link
            href={nextHref}
            transitionTypes={["nav-forward"]}
            className="group/next mt-28 block border-t border-border/70 pt-14 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:mt-40 md:pt-20"
          >
            <span className="block font-mono text-sm lowercase text-muted-foreground">{t.nextLabel}</span>
            <span className="mt-5 block font-serif text-3xl leading-[1.1] tracking-[-0.02em] text-balance md:text-[2.75rem]">
              <ProjectMorph slug={next.slug}>
                <span className="inline-block">{next.title}</span>
              </ProjectMorph>
              <span
                aria-hidden="true"
                className={cn("ml-3 inline-block text-primary transition-[translate] duration-500 group-hover/next:translate-x-2", ease)}
              >
                →
              </span>
            </span>
            {(next.short ?? next.tagline) && (
              <span className="mt-3 block text-base leading-relaxed text-muted-foreground md:text-lg">{next.short ?? next.tagline}</span>
            )}
          </Link>
        )}
      </div>
    </main>
  )
}
