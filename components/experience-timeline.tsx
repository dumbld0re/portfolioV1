"use client"

import type { ExperienceItem } from "@/content/experience"
import { cn } from "@/lib/utils"

// A plain vertical timeline beside the experience list, newest on top: one
// line, one dot per role. The role currently in view (or hovered) lights up.
export function ExperienceTimeline({ experiences, active }: { experiences: ExperienceItem[]; active: number }) {
  return (
    <ol className="relative">
      {/* The spine runs from the first dot to the last. */}
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-border" />

      {experiences.map((exp, i) => {
        const isActive = i === active
        return (
          <li key={exp.company + i} className="relative pb-10 pl-10 last:pb-0">
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-1.5 size-[11px] rounded-full border-2 transition-colors duration-300",
                isActive ? "border-primary bg-primary" : "border-border bg-background",
              )}
            />
            <p
              className={cn(
                "font-mono text-sm lowercase transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {exp.period}
            </p>
            <p
              className={cn(
                "mt-1 font-serif text-2xl leading-snug transition-colors duration-300",
                isActive ? "text-foreground" : "text-muted-foreground/70",
              )}
            >
              {exp.role}
            </p>
            <p className="mt-0.5 text-muted-foreground/80">{exp.company}</p>
          </li>
        )
      })}
    </ol>
  )
}
