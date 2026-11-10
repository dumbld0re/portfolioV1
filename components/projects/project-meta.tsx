import { projectsContent, type Project } from "@/content/projects"
import type { Language } from "@/lib/i18n"
import { inlineLink } from "@/lib/styles"

export type ProjectsCopy = (typeof projectsContent)[Language]

/** "● in use  internal tool" */
export function ProjectStatus({ project, t }: { project: Project; t: ProjectsCopy }) {
  if (!project.status && !project.internalTool) return null
  return (
    <p className="flex flex-wrap gap-x-4 font-mono text-sm lowercase">
      {project.status && <span className="text-primary">● {t.statusLabels[project.status]}</span>}
      {project.internalTool && <span className="text-muted-foreground">{t.internalToolLabel}</span>}
    </p>
  )
}

/** "view demo ↗ / view source ↗" */
export function ProjectLinks({ project, t }: { project: Project; t: ProjectsCopy }) {
  if (!project.demoHref && !project.githubHref) return null
  return (
    <p className="flex flex-wrap gap-x-3 font-mono text-base text-muted-foreground">
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
  )
}
