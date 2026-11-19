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

/** "view demo ↗" (or "view site ↗"). Source links aren't shown. */
export function ProjectLinks({ project, t }: { project: Project; t: ProjectsCopy }) {
  if (!project.demoHref) return null
  return (
    <p className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-base text-muted-foreground">
      <a href={project.demoHref} target="_blank" rel="noreferrer" className={inlineLink}>
        {(project.demoKind === "site" ? t.viewSiteLabel : t.viewDemoLabel).toLowerCase()} ↗
      </a>
      {project.more && (
        <a href={project.more.href} target="_blank" rel="noreferrer" className={inlineLink}>
          {project.more.label} ↗
        </a>
      )}
    </p>
  )
}
