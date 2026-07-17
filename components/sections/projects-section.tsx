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
        <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-primary">002</span> / {labels.nav.projects}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {t.projects.map((project, i) =>
            project.comingSoon ? (
              <div
                key={i}
                className="aspect-[4/3] rounded-lg border border-dashed border-border bg-card/40 flex items-center justify-center"
              >
                <span className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground/60">
                  {t.comingSoonLabel}
                </span>
              </div>
            ) : (
              <div key={i} className="rounded-lg border border-border bg-card/40 p-6 flex flex-col gap-4">
                <div className="space-y-2">
                  {project.slug && (
                    <p className="font-mono text-xs text-muted-foreground">
                      <span className="text-primary">~/projects/</span>
                      {project.slug}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {project.internalTool && (
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-border bg-foreground/5 text-muted-foreground rounded">
                        {t.internalToolLabel}
                      </span>
                    )}
                    {project.status && (
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-primary/40 text-primary rounded">
                        {t.statusLabels[project.status]}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg w-full sm:w-auto">{project.title}</h3>
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
                    <Button size="sm" asChild>
                      <Link href={project.demoHref} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4" />
                        {project.demoKind === "site" ? t.viewSiteLabel : t.viewDemoLabel}
                      </Link>
                    </Button>
                  )}
                  {project.githubHref && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={project.githubHref} target="_blank" rel="noreferrer">
                        <Github className="size-4" />
                        {t.viewSourceLabel}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
