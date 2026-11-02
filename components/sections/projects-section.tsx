"use client"

import { projectsContent } from "@/content/projects"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { ProjectPreview } from "@/components/project-preview"
import { column, inlineLink, measure, sectionLabel } from "@/lib/styles"
import { useActiveIndex } from "@/lib/use-active-index"
import { cn } from "@/lib/utils"

export function ProjectsSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = projectsContent[language]
  const { active, bind } = useActiveIndex(t.projects.length)
  // On wide screens the list sits beside a sticky preview; the current item
  // stays at full strength and the rest step back.
  const dim = (i: number) => cn("transition-opacity duration-500", i !== active && "lg:opacity-50")

  return (
    <section id="projects" className="scroll-mt-10 px-6 md:px-12 py-24 md:py-32">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>
          {labels.nav.projects}
        </h2>
        <p className="mt-6 font-serif text-5xl leading-tight tracking-[-0.02em] md:text-7xl">{t.heading}</p>

        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,48rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <ol className={`${measure} space-y-16`}>
          {t.projects.map((project, i) => {
            if (project.comingSoon) {
              return (
                <li key={i} {...bind(i)} className={cn("text-muted-foreground/60", dim(i))}>
                  <span className="font-serif text-3xl lowercase md:text-4xl">
                    {t.comingSoonLabel}
                    <span className="text-primary motion-safe:animate-caret-blink" aria-hidden="true">
                      _
                    </span>
                  </span>
                </li>
              )
            }

            return (
              <li key={i} {...bind(i)} className={dim(i)}>
                <div className="space-y-3">
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

        <aside aria-hidden="true" className="hidden lg:block">
          <div className="sticky top-24">
            <ProjectPreview
              project={t.projects[active]}
              folder={labels.nav.projects.toLowerCase()}
              comingSoonLabel={t.comingSoonLabel}
            />
          </div>
        </aside>
        </div>
      </div>
    </section>
  )
}
