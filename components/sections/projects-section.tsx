"use client"

import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"

import { projectsContent } from "@/content/projects"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { RollText } from "@/components/roll-text"

export function ProjectsSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = projectsContent[language]

  const pill =
    "group/btn inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-label uppercase tracking-[0.2em] transition-colors duration-300"

  return (
    <section id="projects" className="scroll-mt-20 px-6 md:px-12 lg:px-16 py-24 md:py-36">
      <div className="mx-auto max-w-[90rem]">
        <div data-reveal className="relative flex items-end justify-between gap-6 pb-6">
          <span aria-hidden="true" className="line-draw absolute inset-x-0 bottom-0 h-px bg-border" />
          <div className="space-y-6">
            <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
              <span className="text-primary">002</span> / {labels.nav.projects}
            </h2>
            <p className="font-serif text-[clamp(2.75rem,1.5rem+5vw,7.5rem)] leading-[0.9] tracking-[-0.03em]">
              {t.heading}
            </p>
          </div>
        </div>

        <ol>
          {t.projects.map((project, i) => {
            const number = String(i + 1).padStart(2, "0")

            if (project.comingSoon) {
              return (
                <li
                  key={i}
                  data-reveal
                  className="grid grid-cols-[3rem_1fr] md:grid-cols-12 items-baseline gap-x-6 border-b border-dashed border-border py-8 md:py-10 text-muted-foreground/60"
                >
                  <span className="font-mono text-sm md:col-span-1">{number}</span>
                  <span className="font-serif text-3xl md:text-5xl md:col-span-11">
                    {t.comingSoonLabel}
                    <span className="text-primary motion-safe:animate-caret-blink" aria-hidden="true">
                      _
                    </span>
                  </span>
                </li>
              )
            }

            return (
              <li key={i} data-reveal className="group relative border-b border-border/60">
                {/* Wipe-in fill behind the row on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-card transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-within:scale-y-100"
                />
                <div className="grid grid-cols-[3rem_1fr] md:grid-cols-12 items-baseline gap-x-6 gap-y-3 py-8 md:py-10 md:px-4">
                  <span className="font-mono text-sm text-muted-foreground transition-colors group-hover:text-primary md:col-span-1">
                    {number}
                  </span>

                  <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:col-span-6 md:group-hover:translate-x-4">
                    {project.title}
                  </h3>

                  <p className="col-start-2 md:col-start-auto md:col-span-3 font-mono text-xs text-muted-foreground leading-relaxed">
                    {project.tech.join(" · ")}
                  </p>

                  <div className="col-start-2 md:col-start-auto md:col-span-2 flex flex-wrap items-center gap-2 md:justify-end font-mono text-[10px] uppercase tracking-widest">
                    {project.internalTool && (
                      <span className="rounded-full border border-border px-2.5 py-1 text-foreground/70">{t.internalToolLabel}</span>
                    )}
                    {project.status && (
                      <span className="rounded-full border border-primary/40 px-2.5 py-1 text-primary">
                        {t.statusLabels[project.status]}
                      </span>
                    )}
                  </div>

                  {/* Details unfold on hover/focus on desktop; always open on touch. */}
                  <div className="col-start-2 md:col-start-2 md:col-span-11 grid md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <div className="overflow-hidden">
                      <div className="grid gap-6 pt-4 md:grid-cols-11 md:gap-x-6">
                        <div className="md:col-span-6 md:pl-4 space-y-2">
                          {project.slug && (
                            <p className="font-mono text-xs text-muted-foreground">
                              <span className="text-primary">~/projects/</span>
                              {project.slug}
                            </p>
                          )}
                          {project.tagline && <p className="text-foreground/80">{project.tagline}</p>}
                          <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                        </div>
                        <div className="md:col-span-5 flex flex-wrap items-start gap-3 md:justify-end">
                          {project.demoHref && (
                            <Link
                              href={project.demoHref}
                              target="_blank"
                              rel="noreferrer"
                              className={`${pill} border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary`}
                            >
                              <RollText>{project.demoKind === "site" ? t.viewSiteLabel : t.viewDemoLabel}</RollText>
                              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/btn:rotate-45" />
                            </Link>
                          )}
                          {project.githubHref && (
                            <Link
                              href={project.githubHref}
                              target="_blank"
                              rel="noreferrer"
                              className={`${pill} border-border text-foreground hover:border-foreground`}
                            >
                              <Github className="size-3.5 transition-transform duration-300 group-hover/btn:-rotate-12" />
                              <RollText>{t.viewSourceLabel}</RollText>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
