"use client"

import { useEffect, useRef, useState } from "react"

import { ProjectPreview } from "@/components/project-preview"
import { ProjectLinks, ProjectStatus, type ProjectsCopy } from "@/components/projects/project-meta"
import { cn } from "@/lib/utils"

/** The space the travelling card may fill: tall enough for two wide screens, one under the other. */
const CARD = { width: 416, height: 500 }
/** How far the card sits from the pointer, and from the screen's edges. */
const OFFSET = 28
const EDGE = 24

// The projects view wide screens with a mouse start in: the list is only
// words, and the hovered project's screens travel with the pointer.
export function ProjectIndex({ t }: { t: ProjectsCopy }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const list = useRef<HTMLOListElement>(null)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = card.current
    if (!el) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let x = -1
    let y = -1
    let cx = 0
    let cy = 0
    let placed = false
    let frame = 0
    const tick = () => {
      frame = requestAnimationFrame(tick)
      if (x < 0) return
      // Below the pointer, so the row being read stays clear; above it when
      // there's no room underneath; and beside it when a tall card fits
      // neither way.
      const height = el.offsetHeight
      const tx = Math.max(EDGE, Math.min(x + OFFSET, window.innerWidth - el.offsetWidth - EDGE))
      const below = y + OFFSET
      const above = y - height - OFFSET
      const ty =
        below + height <= window.innerHeight - EDGE
          ? below
          : above >= EDGE
            ? above
            : Math.max(EDGE, Math.min(y - height / 2, window.innerHeight - height - EDGE))
      // Trails the pointer a little; arrives at once the first time.
      const k = still || !placed ? 1 : 0.16
      placed = true
      cx += (tx - cx) * k
      cy += (ty - cy) * k
      el.style.transform = `translate3d(${Math.round(cx)}px, ${Math.round(cy)}px, 0)`
    }
    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
    }
    // The page can scroll under a still mouse: re-check what's beneath it.
    const onScroll = () => {
      if (x < 0 || !list.current) return
      const item = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-project]")
      setHovered(item && list.current.contains(item) ? Number(item.dataset.project) : null)
    }
    frame = requestAnimationFrame(tick)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <ol ref={list} className="mt-14 border-b border-border/70" onMouseLeave={() => setHovered(null)}>
        {t.projects.map((project, i) => (
          <li
            key={project.slug ?? i}
            data-project={i}
            onMouseEnter={() => setHovered(i)}
            className={cn(
              "grid grid-cols-[minmax(0,6fr)_minmax(0,5fr)] items-start gap-x-16 border-t border-border/70 py-10 transition-opacity duration-500",
              hovered !== null && hovered !== i && "opacity-40",
            )}
          >
            <div className="space-y-4">
              <h3
                className={cn(
                  "font-serif text-6xl leading-[1.1] tracking-[-0.02em] transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  hovered === i && "translate-x-4",
                )}
              >
                {project.title}
              </h3>
              <ProjectStatus project={project} t={t} />
            </div>
            <div className="space-y-4 pt-3">
              <p className="text-lg leading-relaxed text-muted-foreground">{project.tagline ?? project.description}</p>
              <p className="font-mono text-sm text-muted-foreground/80">{project.tech.join(" · ")}</p>
              <ProjectLinks project={project} t={t} />
            </div>
          </li>
        ))}
      </ol>

      <div
        ref={card}
        aria-hidden="true"
        style={{ width: CARD.width }}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-40 transition-opacity duration-300",
          hovered === null ? "opacity-0" : "opacity-100",
        )}
      >
        {t.projects.map((project, i) => (
          <div key={project.slug ?? i} className={cn(i === hovered ? "motion-safe:animate-page-fade" : "hidden")}>
            <ProjectPreview project={project} room={CARD} />
          </div>
        ))}
      </div>
    </>
  )
}
