"use client"

import Link from "next/link"

import { hasCase, projectPath } from "@/content/projects"
import { useLanguage } from "@/components/language-provider"
import type { ProjectsCopy } from "@/components/projects/project-meta"
import { ProjectMorph } from "@/components/projects/morph"
import { localizePath } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// The projects list, set like the posts list: each title with its one short
// line under it. Where a post shows its date, a project's arrow springs in on
// hover. The title carries over into the case study's heading.
export function ProjectList({ t }: { t: ProjectsCopy }) {
  const { language } = useLanguage()

  return (
    <ol className="mt-12 space-y-6 short:mt-8">
      {t.projects.map((project, i) => {
        const subtitle = project.short ?? project.tagline
        const body = (
          <>
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="font-serif text-xl lowercase tracking-[-0.01em] underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-primary md:text-2xl">
                <ProjectMorph slug={project.slug}>
                  <span className="inline-block">{project.title}</span>
                </ProjectMorph>
              </h2>
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0 -translate-x-2 scale-50 font-mono text-sm text-primary opacity-0",
                  "transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  "group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100",
                  "group-focus-visible:translate-x-0 group-focus-visible:scale-100 group-focus-visible:opacity-100",
                  "motion-reduce:transition-opacity",
                )}
              >
                {project.demoOnly ? "↗" : "→"}
              </span>
            </div>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </>
        )
        return (
          <li key={project.slug ?? i}>
            {project.demoOnly && project.demoHref ? (
              <a
                href={project.demoHref}
                target="_blank"
                rel="noreferrer"
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                {body}
              </a>
            ) : hasCase(project) ? (
              <Link
                href={localizePath(language, projectPath(project.slug))}
                transitionTypes={["nav-forward"]}
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                {body}
              </Link>
            ) : (
              <div>{body}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
