"use client"

import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"

import { projectsContent } from "@/content/projects"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function ProjectsSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = projectsContent[language]

  return (
    <section id="projects" className="scroll-mt-20 px-6 py-20 md:py-28">
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 data-reveal className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-primary">002</span> / {labels.nav.projects}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {t.projects.map((project, i) => (
            // The wrapper carries the scroll reveal (staggered across the
            // grid) so it doesn't fight the card's own hover transform.
            <div key={i} data-reveal style={{ transitionDelay: `${(i % 2) * 90}ms` }} className="flex">
            {project.comingSoon ? (
              <div className="w-full aspect-[4/3] rounded-lg border border-dashed border-border bg-card/40 flex items-center justify-center">
                <span className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
                  {t.comingSoonLabel}
                </span>
              </div>
            ) : (
              <div className="w-full rounded-lg border border-border bg-card/40 p-6 flex flex-col gap-4 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-black/10">
                <div className="space-y-2">
                  {project.slug && (
                    <p className="font-mono text-xs text-muted-foreground">
                      <span className="text-primary">~/projects/</span>
                      {project.slug}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {project.internalTool && (
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-border bg-foreground/5 text-foreground/80 rounded">
                        {t.internalToolLabel}
                      </span>
                    )}
                    {project.status && (
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-primary/40 text-primary rounded">
                        {t.statusLabels[project.status]}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg w-full">{project.title}</h3>
                  </div>
                  {project.tagline && (
                    <p className="text-sm italic text-foreground/80">{project.tagline}</p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <span
                      key={item}
                      className="text-xs font-mono px-2 py-1 bg-foreground/5 border border-border rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 mt-auto pt-2">
                  {project.demoHref && (
                    <Button size="sm" asChild className="group/btn">
                      <Link href={project.demoHref} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4 transition-transform duration-300 ease-out group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        {project.demoKind === "site" ? t.viewSiteLabel : t.viewDemoLabel}
                      </Link>
                    </Button>
                  )}
                  {project.githubHref && (
                    <Button size="sm" variant="outline" asChild className="group/btn">
                      <Link href={project.githubHref} target="_blank" rel="noreferrer">
                        <Github className="size-4 transition-transform duration-300 ease-out group-hover/btn:-rotate-12" />
                        {t.viewSourceLabel}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
