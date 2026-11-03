"use client"

import { useSyncExternalStore } from "react"

import type { ExperienceItem } from "@/content/experience"
import { monthEnd, monthStart } from "@/lib/format-date"
import { cn } from "@/lib/utils"

const noop = () => () => {}
const thisMonth = () => {
  const d = new Date()
  return d.getFullYear() * 12 + d.getMonth()
}

// Beside the experience list: one bar per role on a shared time axis, so
// roles that ran at the same time sit on top of each other. The role in view
// (or hovered) in the list lights up here.
export function ExperienceOverlap({
  experiences,
  active,
  present,
}: {
  experiences: ExperienceItem[]
  active: number
  /** Label for the line marking today ("now"). */
  present: string
}) {
  const starts = experiences.map((e) => monthStart(e.start))
  // On the server, "now" is the newest start month; the browser swaps in the
  // real month, so ongoing roles always reach today.
  const now = useSyncExternalStore(noop, thisMonth, () => Math.max(...starts))
  const from = Math.floor(Math.min(...starts) / 12) * 12
  const to = Math.max(now + 1, ...experiences.map((e) => (e.end ? monthEnd(e.end) : 0)))
  const at = (month: number) => ((month - from) / (to - from)) * 100

  const years: number[] = []
  for (let m = from; m < to; m += 12) years.push(m)

  // Year lines plus the "now" edge, repeated in each row so they read as one
  // continuous grid behind the bars.
  const grid = (
    <>
      {years.map((m) => (
        <span key={m} className="absolute inset-y-0 w-px bg-border/60" style={{ left: `${at(m)}%` }} />
      ))}
      <span className="absolute inset-y-0 right-0 w-px bg-primary/40" />
    </>
  )

  return (
    <figure aria-hidden="true" className="font-mono text-xs lowercase">
      {/* "now" sits on top of its line, clear of the year labels below. */}
      <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4">
        <span />
        <span className="pb-1 text-right text-primary">{present}</span>
      </div>
      <ol>
        {experiences.map((exp, i) => {
          const isActive = i === active
          const left = at(monthStart(exp.start))
          const right = exp.end ? at(monthEnd(exp.end)) : 100
          return (
            <li key={exp.company + exp.start} className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-x-4">
              <span
                className={cn(
                  "truncate py-2.5 transition-colors duration-300",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {exp.company}
              </span>
              <span className="relative self-stretch">
                {grid}
                <span
                  className={cn(
                    "absolute top-1/2 h-1.5 min-w-1.5 -translate-y-1/2 rounded-full transition-colors duration-300",
                    isActive ? "bg-primary" : "bg-foreground/25",
                  )}
                  style={{ left: `${left}%`, width: `${right - left}%` }}
                />
              </span>
            </li>
          )
        })}
      </ol>

      <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 text-muted-foreground">
        <span />
        <span className="relative h-6">
          {years
            // A year that has only just begun has no room for its label.
            .filter((m) => at(m) < 90)
            .map((m) => (
              <span key={m} className="absolute top-2 pl-1.5" style={{ left: `${at(m)}%` }}>
                {m / 12}
              </span>
            ))}
        </span>
      </div>
    </figure>
  )
}
