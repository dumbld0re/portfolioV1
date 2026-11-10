"use client"

import { useState } from "react"

import type { Project } from "@/content/projects"
import { Shot, Window } from "@/components/project-preview"
import { ProjectLinks, ProjectStatus, type ProjectsCopy } from "@/components/projects/project-meta"
import { cn } from "@/lib/utils"

const lift = "transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"

// A tool without a UI shows a short session. Hovering runs it again, a line
// at a time.
function Session({ lines }: { lines: string[] }) {
  const [run, setRun] = useState(0)
  return (
    <div className="w-full max-w-[34rem]" onMouseEnter={() => setRun((n) => n + 1)}>
      <Window>
        <pre
          key={run}
          className="flex aspect-[16/10] flex-col justify-center gap-1.5 overflow-hidden px-4 font-mono text-[11px] leading-relaxed text-muted-foreground min-[400px]:text-xs sm:px-8 sm:text-sm"
        >
          {lines.map((line, i) => (
            <span
              key={i}
              style={run ? { animationDelay: `${i * 320}ms` } : undefined}
              className={cn(
                run > 0 && "motion-safe:animate-page-fade",
                line.startsWith("$") ? "text-foreground" : line.includes("✓") ? "text-primary" : undefined,
              )}
            >
              {line}
            </span>
          ))}
          <span className="text-foreground">
            $ <span className="text-primary motion-safe:animate-caret-blink">_</span>
          </span>
        </pre>
      </Window>
    </div>
  )
}

// What stands in a project's panel. The hover lives on the screens: phone
// screens step apart and the one under the pointer lifts; wide screens sit as
// a deck that slides open.
function Screens({ project }: { project: Project }) {
  const preview = project.preview
  if (preview.kind === "terminal") return <Session lines={preview.lines} />

  const alt = (screenName?: string) => (screenName ? `${project.title}: ${screenName}` : project.title)

  if (preview.screens.some((s) => s.height > s.width)) {
    return (
      <div className="flex items-start justify-center gap-3 sm:gap-6">
        {preview.screens.map((screen, i) => (
          <Window
            key={screen.src}
            className={cn(
              "w-[9rem] min-[400px]:w-[9.5rem] sm:w-[15rem]",
              lift,
              "hover:-translate-y-3 group-hover/stage:opacity-60 hover:!opacity-100",
              i % 2 === 1 ? "mt-10 group-hover/stage:translate-x-3" : "group-hover/stage:-translate-x-3",
            )}
          >
            <Shot screen={screen} alt={alt(screen.name)} />
          </Window>
        ))}
      </div>
    )
  }

  // With a mouse, the second screen waits behind the first (which needs its
  // own layer to stay on top) and the two slide apart on hover; pointing at
  // the second brings it forward, over the first. Without a mouse, they
  // simply stack.
  const [first, second] = preview.screens
  return (
    <div className="flex w-full max-w-[36rem] flex-col gap-4 [@media(hover:hover)]:grid [@media(hover:hover)]:gap-0">
      <div
        className={cn(
          "relative z-10 col-start-1 row-start-1",
          lift,
          second && "[@media(hover:hover)]:group-hover/stage:-translate-x-10 [@media(hover:hover)]:group-hover/stage:-translate-y-14",
        )}
      >
        <Window>
          <Shot screen={first} alt={alt(first.name)} />
        </Window>
      </div>
      {second && (
        <div
          className={cn(
            "col-start-1 row-start-1",
            lift,
            "[@media(hover:hover)]:translate-x-4 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-50",
            "[@media(hover:hover)]:group-hover/stage:translate-x-10 [@media(hover:hover)]:group-hover/stage:translate-y-14 [@media(hover:hover)]:group-hover/stage:opacity-100",
            "[@media(hover:hover)]:hover:z-20 [@media(hover:hover)]:hover:!translate-x-2 [@media(hover:hover)]:hover:!translate-y-2",
          )}
        >
          <Window>
            <Shot screen={second} alt={alt(second.name)} />
          </Window>
        </div>
      )}
    </div>
  )
}

// The projects view for touch screens, and the second one elsewhere: each project gets a large panel for its screens,
// with its text anchored low beside it, the sides alternating.
export function ProjectStage({ t }: { t: ProjectsCopy }) {
  return (
    <ol className="mt-14 space-y-20 lg:space-y-28">
      {t.projects.map((project, i) => (
        <li key={project.slug ?? i} className="grid gap-x-16 gap-y-8 lg:grid-cols-12 lg:items-end">
          <div className={cn("space-y-4 lg:col-span-4 lg:pb-2", i % 2 === 1 && "lg:order-last")}>
            <ProjectStatus project={project} t={t} />
            <h3 className="font-serif text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl">{project.title}</h3>
            {project.tagline && <p className="text-lg leading-relaxed text-foreground/85">{project.tagline}</p>}
            <p className="text-lg leading-relaxed text-muted-foreground">{project.description}</p>
            <p className="font-mono text-sm text-muted-foreground/80">{project.tech.join(" · ")}</p>
            <ProjectLinks project={project} t={t} />
          </div>
          <div className="group/stage flex items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-foreground/[0.03] px-3 py-10 sm:px-10 sm:py-12 lg:col-span-8 lg:min-h-[38rem]">
            <Screens project={project} />
          </div>
        </li>
      ))}
    </ol>
  )
}
