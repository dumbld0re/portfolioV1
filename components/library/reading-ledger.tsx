"use client"

import { libraryTopics } from "@/content/library-topics"
import type { LibraryEntry } from "@/lib/library-types"
import { cn } from "@/lib/utils"

const MONTHS = 12
const MONTH_SHORT = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" })
const MONTH_LONG = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" })

// A year of reading as a column of dots per month — the ASCII background's
// dots stacked into a histogram. Dot size is reading length, color is topic,
// and whatever is being read right now blinks as a caret in the current month.
// Drawn as CSS shapes: the mono font's · • ● glyphs are too small to read.
const MARK = "rounded-full bg-current"

function markClass(entry: LibraryEntry) {
  if (entry.status === "reading") return "h-3.5 w-1.5 bg-primary motion-safe:animate-caret-blink"
  if (entry.minutes < 15) return `size-1 ${MARK}`
  if (entry.minutes < 60) return `size-2 ${MARK}`
  return `size-3 ${MARK}`
}

export function ReadingLedger({
  entries,
  matches,
  now,
  highlighted,
  onHighlight,
  onSelect,
}: {
  entries: LibraryEntry[]
  /** Slugs passing the current filter; the rest fade back. */
  matches: Set<string>
  /** Build time as YYYY-MM, so server and client agree on the window. */
  now: string
  highlighted: string | null
  onHighlight: (slug: string | null) => void
  onSelect: (entry: LibraryEntry) => void
}) {
  const [year, month] = now.split("-").map(Number)
  const columns = Array.from({ length: MONTHS }, (_, i) => {
    const date = new Date(Date.UTC(year, month - MONTHS + i, 1))
    return { key: date.toISOString().slice(0, 7), date, entries: [] as LibraryEntry[] }
  })
  const byKey = new Map(columns.map((column) => [column.key, column]))
  const current = columns.at(-1)!

  for (const entry of entries) {
    if (entry.status === "queued") continue
    const column = entry.status === "reading" ? current : byKey.get((entry.finished ?? entry.added).slice(0, 7))
    column?.entries.push(entry)
  }

  return (
    <figure className="space-y-3">
      <div className="grid grid-cols-12 items-end gap-1 min-h-16" role="list" aria-label="Reading over the last twelve months">
        {columns.map((column) => (
          <div
            key={column.key}
            role="listitem"
            aria-label={monthLabel(column.date, column.entries)}
            className="flex flex-col-reverse items-center font-mono leading-none"
          >
            {column.entries.length === 0 && (
              <span aria-hidden="true" className="flex h-5 items-center">
                <span className="size-0.5 rounded-full bg-muted-foreground/40" />
              </span>
            )}
            {column.entries.map((entry) => {
              const active = highlighted === entry.slug
              return (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => onSelect(entry)}
                  onPointerEnter={() => onHighlight(entry.slug)}
                  onPointerLeave={() => onHighlight(null)}
                  onFocus={() => onHighlight(entry.slug)}
                  onBlur={() => onHighlight(null)}
                  aria-label={`${entry.title} (${entry.callNumber})`}
                  title={entry.title}
                  className={cn(
                    "flex h-5 w-7 items-center justify-center transition-[opacity,transform] duration-300 ease-out hover:scale-150 focus-visible:scale-150 outline-none",
                    active && "scale-150",
                    !matches.has(entry.slug) && "opacity-15",
                  )}
                  style={{ color: libraryTopics[entry.topic].color }}
                >
                  <span aria-hidden="true" className={markClass(entry)} />
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-1 border-t border-border pt-2 font-mono text-[0.625rem] md:text-xs text-muted-foreground" aria-hidden="true">
        {columns.map((column) => (
          <span key={column.key} className={cn("text-center", column === current && "text-primary")}>
            {/* Initial on phones, short name from md up. */}
            <span className="md:hidden">{MONTH_SHORT.format(column.date).charAt(0)}</span>
            <span className="hidden md:inline">{MONTH_SHORT.format(column.date).toLowerCase()}</span>
          </span>
        ))}
      </div>
      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground/70">
        {[
          ["size-1", "under 15 min"],
          ["size-2", "under an hour"],
          ["size-3", "longer"],
        ].map(([size, label]) => (
          <span key={label} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={cn(size, MARK)} />
            {label}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3.5 w-1.5 bg-primary" />
          reading now
        </span>
      </figcaption>
    </figure>
  )
}

function monthLabel(date: Date, entries: LibraryEntry[]) {
  const reading = entries.filter((entry) => entry.status === "reading").length
  const read = entries.length - reading
  return `${MONTH_LONG.format(date)}: ${read} read${reading ? `, ${reading} in progress` : ""}`
}
