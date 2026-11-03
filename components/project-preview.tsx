"use client"

import Image from "next/image"
import type { ReactNode } from "react"

import type { Project, Screen } from "@/content/projects"
import { cn } from "@/lib/utils"

/** Height of a window's path bar, in px. */
const BAR = 38
/** Gap between stacked windows, and how far the later ones step right. */
const GAP = 16
const STEP = 40

/** The space the cards may fill: the column's width and the free height. */
export type Room = { width: number; height: number }

// How many wide screens fit stacked in the room. The first always shows.
function stackedCount(screens: Screen[], room: Room | null) {
  if (!room || screens.length < 2) return screens.length
  const width = room.width - STEP
  let total = 0
  let count = 0
  for (const screen of screens) {
    total += (count ? GAP : 0) + (width * screen.height) / screen.width + BAR
    if (count && total > room.height) break
    count++
  }
  return count
}

// One window: a path bar on top, then the screen or terminal.
function Window({ path, className, children }: { path: string; className?: string; children: ReactNode }) {
  return (
    <figure
      className={cn(
        "min-w-0 overflow-hidden rounded-md border border-border/70 bg-background shadow-[0_18px_40px_-20px_rgb(0_0_0/0.35)]",
        className,
      )}
    >
      <figcaption className="truncate border-b border-border/70 px-4 py-2.5 font-mono text-xs text-muted-foreground">
        <span className="text-primary">{path.slice(0, path.lastIndexOf("/") + 1)}</span>
        {path.slice(path.lastIndexOf("/") + 1)}
      </figcaption>
      {children}
    </figure>
  )
}

// Served at full resolution (images are unoptimised), so the capture itself
// sets the sharpness: export at 2-3x the size it shows here.
function Shot({ screen, alt }: { screen: Screen; alt: string }) {
  return (
    <Image
      src={screen.src}
      alt={alt}
      width={screen.width}
      height={screen.height}
      sizes="(min-width: 1024px) 32rem, 100vw"
      className="block h-auto w-full"
    />
  )
}

// The cards beside the project list for the hovered project: one window per
// screen, or a terminal session for tools without a UI. Phone screens stand
// side by side, the second a step lower. Wide screens stack, the later ones a
// step to the right, and only as many as fit in the room left on screen.
export function ProjectPreview({
  project,
  folder,
  room,
}: {
  project: Project
  /** "projects" / "projekte", for the ~/<folder>/<slug> path. */
  folder: string
  /** Free space for the cards; null until measured (then all show). */
  room: Room | null
}) {
  const preview = project.preview
  const base = `~/${folder}/${project.slug ?? "…"}`

  if (preview.kind === "terminal") {
    return (
      <Window path={base}>
        <pre className="flex aspect-[4/3] flex-col justify-center gap-1.5 overflow-hidden px-8 font-mono text-sm leading-relaxed text-muted-foreground">
          {preview.lines.map((line, i) => (
            <span key={i} className={line.startsWith("$") ? "text-foreground" : line.includes("✓") ? "text-primary" : undefined}>
              {line}
            </span>
          ))}
          <span className="text-foreground">
            ${" "}
            <span className="text-primary motion-safe:animate-caret-blink">_</span>
          </span>
        </pre>
      </Window>
    )
  }

  const tall = preview.screens.some((s) => s.height > s.width)
  const screens = tall ? preview.screens : preview.screens.slice(0, stackedCount(preview.screens, room))
  const several = screens.length > 1
  // Several narrow cards side by side drop the ~/folder prefix to fit.
  const path = (screen: Screen) =>
    screen.name ? (tall && several ? `${project.slug ?? "…"}/${screen.name}` : `${base}/${screen.name}`) : base

  if (tall) {
    return (
      <div
        className={cn(
          "flex items-start gap-4",
          // Sized by height, so the pair always fits under the sticky top
          // with room to spare on short laptop screens.
          several ? "max-w-[calc((100svh-9rem)*0.8)]" : "max-w-[calc((100svh-9rem)*0.42)]",
        )}
      >
        {screens.map((screen, i) => (
          <Window key={screen.src} path={path(screen)} className={cn("flex-1", i % 2 === 1 && "mt-10")}>
            <Shot screen={screen} alt={screen.name ? `${project.title}: ${screen.name}` : project.title} />
          </Window>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ gap: GAP }}>
      {screens.map((screen, i) => (
        // The margins animate, so the first card eases aside as a second
        // one joins (more room after a scroll), and back when it leaves.
        <div
          key={screen.src}
          className="transition-[margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={several ? (i % 2 === 1 ? { marginLeft: STEP } : { marginRight: STEP }) : undefined}
        >
          <Window path={path(screen)} className={cn(i > 0 && "motion-safe:animate-page-fade")}>
            <Shot screen={screen} alt={screen.name ? `${project.title}: ${screen.name}` : project.title} />
          </Window>
        </div>
      ))}
    </div>
  )
}
