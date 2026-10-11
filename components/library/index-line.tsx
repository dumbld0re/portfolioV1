"use client"

import { ArrowUpRight } from "lucide-react"

import { libraryTopics } from "@/content/library-topics"
import { formatMinutes } from "@/lib/library-query"
import type { LibraryEntry } from "@/lib/library-types"
import { cn } from "@/lib/utils"

const DATE = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

// Leader dots between title and reading time, drawn from the same glyphs as
// the ASCII background. Seeded by slug so each line has its own (stable)
// texture and server and client render the same string.
function leader(seed: string) {
  let h = 0
  for (const char of seed) h = (h * 31 + char.charCodeAt(0)) >>> 0
  let out = ""
  for (let i = 0; i < 90; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    out += (h >>> 16) % 7 === 0 ? "· " : ". "
  }
  return out
}

function shortAuthor(author: string) {
  // "Ben Moseley & Peter Marks" -> "Moseley & Marks", "Vaswani et al." stays.
  if (author.includes(" et al.")) return author
  return author
    .split(" & ")
    .map((name) => name.trim().split(/\s+/).at(-1))
    .join(" & ")
}

export function IndexLine({
  entry,
  open,
  highlighted,
  onToggle,
}: {
  entry: LibraryEntry
  open: boolean
  /** Set while the entry's glyph in the reading ledger is hovered. */
  highlighted: boolean
  onToggle: () => void
}) {
  const topic = libraryTopics[entry.topic]
  const panelId = `entry-${entry.slug}`
  const [code, number] = entry.callNumber.split(".")
  const queued = entry.status === "queued"

  return (
    <li
      id={entry.callNumber}
      className="scroll-mt-28 border-b border-border/60 last:border-0"
      style={{ viewTransitionName: `entry-${entry.slug}` }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "group flex w-full items-baseline gap-3 md:gap-4 py-3 text-left outline-none transition-colors focus-visible:bg-card/80",
          highlighted && "bg-card/80",
        )}
      >
        <span className="w-14 shrink-0 font-mono text-xs md:text-sm text-muted-foreground tabular-nums">
          {/* Mixed toward the text color: some gruvbox chart hues (the yellows)
              are too faint for small text on the white light-mode page. */}
          <span style={{ color: `color-mix(in oklab, ${topic.color} 70%, var(--foreground))` }}>{code}</span>.{number}
        </span>

        <span
          className={cn(
            "min-w-0 font-serif text-lg md:text-xl leading-snug transition-colors group-hover:text-primary",
            (open || highlighted) && "text-primary",
            queued && "text-muted-foreground",
          )}
        >
          {entry.title}
          {entry.status === "reading" && (
            <span className="ml-1.5 font-mono text-primary motion-safe:animate-caret-blink" title="Reading now">
              ▍<span className="sr-only">(reading now)</span>
            </span>
          )}
          {queued && <span className="sr-only"> (queued)</span>}
        </span>

        <span
          aria-hidden="true"
          className="min-w-6 flex-1 overflow-hidden whitespace-nowrap font-mono text-xs text-muted-foreground/40 select-none"
        >
          {leader(entry.slug)}
        </span>

        <span className="shrink-0 font-mono text-xs md:text-sm text-muted-foreground tabular-nums">
          {formatMinutes(entry.minutes)}
        </span>
        <span className="hidden md:block w-44 shrink-0 truncate font-mono text-sm text-muted-foreground/70">
          {shortAuthor(entry.author)}
          {entry.year && ` '${String(entry.year).slice(-2)}`}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "w-3 shrink-0 font-mono text-sm text-muted-foreground transition-transform duration-300 ease-out group-hover:text-primary",
            open && "rotate-45 text-primary",
          )}
        >
          +
        </span>
      </button>

      {/* grid-rows 0fr -> 1fr animates to the panel's natural height. */}
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="md:pl-[4.5rem] pb-8 pt-1 space-y-5">
            <dl className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <div className="flex gap-2">
                <dt className="sr-only">By</dt>
                <dd className="normal-case tracking-normal text-sm text-foreground/80">{entry.author}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="sr-only">Topic</dt>
                <dd className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full" style={{ background: topic.color }} aria-hidden="true" />
                  {topic.label}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="sr-only">Kind</dt>
                <dd>
                  {entry.kind}
                  {entry.year && ` · ${entry.year}`}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="sr-only">Status</dt>
                <dd>{statusLine(entry)}</dd>
              </div>
            </dl>

            {entry.notesHtml ? (
              <div
                className="post-prose border-l border-primary/60 pl-6 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: entry.notesHtml }}
              />
            ) : (
              <p className="border-l border-border pl-6 font-mono text-sm text-muted-foreground/70">no notes yet.</p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm">
              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="group/open inline-flex items-center gap-1 text-primary hover:underline underline-offset-4"
              >
                open source
                <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover/open:-translate-y-0.5 group-hover/open:translate-x-0.5" />
              </a>
              <a href={`#${entry.callNumber}`} className="text-muted-foreground hover:text-foreground transition-colors">
                #{entry.callNumber}
              </a>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

function statusLine(entry: LibraryEntry) {
  if (entry.status === "reading") return `reading since ${DATE.format(new Date(entry.added))}`
  if (entry.status === "queued") return `queued ${DATE.format(new Date(entry.added))}`
  return `read ${DATE.format(new Date(entry.finished ?? entry.added))}`
}
