"use client"

import type { Project } from "@/content/projects"
import { ProjectPreview, Shot, Window } from "@/components/project-preview"
import { cn } from "@/lib/utils"

export const ease = "ease-[cubic-bezier(0.16,1,0.3,1)]"

export const alt = (project: Project, name?: string) => (name ? `${project.title}: ${name}` : project.title)

// One picture of a project at whatever size its box gives it: the first wide
// screen, a pair of phone screens, or the terminal session.
export function Thumb({ project, className }: { project: Project; className?: string }) {
  const preview = project.preview
  if (preview.kind === "terminal") {
    return (
      <div className={cn("w-full max-w-[30rem]", className)}>
        <ProjectPreview project={project} room={null} />
      </div>
    )
  }
  const tall = preview.screens.some((s) => s.height > s.width)
  if (tall) {
    return (
      <div className={cn("flex w-[62%] max-w-[22rem] items-start gap-3", className)}>
        {preview.screens.slice(0, 2).map((screen, i) => (
          <Window key={screen.src} className={cn("flex-1", i === 1 && "mt-8")}>
            <Shot screen={screen} alt={alt(project, screen.name)} />
          </Window>
        ))}
      </div>
    )
  }
  const [first] = preview.screens
  return (
    <Window className={cn("w-full", className)}>
      <Shot screen={first} alt={alt(project, first.name)} />
    </Window>
  )
}
