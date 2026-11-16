"use client"

import { useMemo, useState, type CSSProperties } from "react"

import { EntryNotes, STATUS_WORD, TONE_INK, TOPIC_TONE, metaLine, shortAuthor } from "@/components/library/v2/shared"
import { useLibraryUrl } from "@/components/library/use-library-url"
import { libraryTopics, type TopicId } from "@/content/library-topics"
import { SORTS, filterEntries, groupEntries, parseQuery, setToken, type Sort } from "@/lib/library-query"
import type { EntryStatus, LibraryEntry, LibraryStats } from "@/lib/library-types"
import { scrollPage } from "@/lib/scroll"
import { sectionLabel } from "@/lib/styles"
import { cn } from "@/lib/utils"

// Option B, "the shelf": every piece stands face-out on a dotted shelf, with
// its real cover: a book's jacket, a paper's first page, an essay's page as
// it looks online (scripts/library-covers.mjs). Pieces with none get one
// drawn in their topic's colour. A cover develops as it's read: up next it
// is only dots, reading now it is solid from the bottom half up, read it is
// whole. Point at a cover to read its name; click it and it opens under the
// shelf. The catalogue below lists the same things in plain mono.

const SORT_WORD: Record<Sort, string> = { "a-z": "a–z", date: "newest", length: "shortest", topic: "topic" }
const STATUSES: (EntryStatus | undefined)[] = [undefined, "read", "reading", "queued"]
/** A book stands a little taller than a paper, a paper than an essay. */
const HEIGHT = { book: 1, paper: 0.92, essay: 0.84, talk: 0.84 } as const

/** The dot screen a cover is seen through until it's read (globals.css, .cover-dots). */
function developed(status: EntryStatus) {
  return status === "read" ? undefined : status === "reading" ? "half" : "dots"
}

/** A cover: the real one, or one drawn for a piece that has none. */
function Cover({ entry, className, style }: { entry: LibraryEntry; className?: string; style?: CSSProperties }) {
  const tone = TOPIC_TONE[entry.topic]
  return (
    <span
      data-dots={developed(entry.status)}
      className={cn("cover-dots relative block aspect-[2/3] overflow-hidden rounded-[3px] bg-card", className)}
      style={style}
    >
      {entry.cover ? (
        // eslint-disable-next-line @next/next/no-img-element -- small local files, sized by the shelf
        <img src={entry.cover} alt="" loading="lazy" decoding="async" className="size-full object-cover object-top" />
      ) : (
        <span
          className="flex size-full flex-col justify-between p-[9%] text-left"
          style={{ background: `var(--pill-${tone})`, color: "var(--pill-ink)" }}
        >
          <span className="font-serif text-[clamp(0.8rem,0.55rem+0.7vw,1.15rem)] leading-[1.1] lowercase">
            {entry.title.toLowerCase()}
          </span>
          <span className="font-mono text-[0.6rem] leading-tight opacity-70">{shortAuthor(entry.author).toLowerCase()}</span>
        </span>
      )}
      {/* The page's edge and a soft light across it, so it reads as a thing. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[3px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08),inset_3px_0_0_rgb(0_0_0/0.06)]" />
    </span>
  )
}

export function ShelfLibrary({ entries, stats }: { entries: LibraryEntry[]; stats: LibraryStats }) {
  const [{ query, sort, open }, setUrl] = useLibraryUrl()
  const [hover, setHover] = useState<LibraryEntry | null>(null)
  const parsed = parseQuery(query)
  const matches = useMemo(() => new Set(filterEntries(entries, query).map((e) => e.slug)), [entries, query])
  // Every piece keeps its place on the shelf; a filter only dims the rest.
  const shelf = useMemo(() => groupEntries(entries, sort).flatMap((g) => g.entries), [entries, sort])
  const selected = entries.find((e) => e.callNumber === open) ?? null
  const shown = hover ?? selected

  const select = (entry: LibraryEntry) => setUrl({ open: open === entry.callNumber ? null : entry.callNumber })

  const counts = useMemo(() => {
    const c: Partial<Record<TopicId, number>> = {}
    for (const e of entries) c[e.topic] = (c[e.topic] ?? 0) + 1
    return c
  }, [entries])

  const option = (on: boolean) =>
    cn("cursor-pointer transition-colors hover:text-foreground", on && "text-foreground underline decoration-primary underline-offset-[5px]")

  return (
    <main className="flex-1 px-6 md:px-12">
      <section className="mx-auto flex max-w-[72rem] flex-col items-center pt-8 text-center md:pt-14">
        <p className={sectionLabel}>dannymiguel.com/read</p>
        <h1 className="mt-4 font-serif text-[clamp(2.25rem,1.5rem+3vw,4rem)] leading-[1.05] tracking-[-0.02em] lowercase">
          the shelf<span className="text-primary">.</span>
        </h1>
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          {stats.total} pieces · {stats.hours} hours · {stats.reading} open
        </p>

        {/* What the pointer is on, or what's open. */}
        <div aria-live="polite" className="mt-10 flex min-h-16 flex-col items-center justify-end md:mt-14">
          {shown ? (
            <>
              <p className="font-serif text-xl leading-tight text-foreground lowercase text-balance md:text-2xl">
                {shown.title.toLowerCase()}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {shortAuthor(shown.author).toLowerCase()} · {metaLine(shown)}
              </p>
            </>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">
              point at a cover <span className="text-primary">↓</span>
            </p>
          )}
        </div>

        {/* The shelf: covers face-out, standing on dotted boards. */}
        <ul
          className="mt-6 flex flex-wrap items-end justify-center gap-x-[var(--gap)] gap-y-12 [--gap:14px] [--h:9.5rem] md:[--gap:22px] md:[--h:12rem] lg:[--h:14rem]"
          onPointerLeave={() => setHover(null)}
        >
          {shelf.map((entry) => {
            const on = selected?.slug === entry.slug
            const dim = !matches.has(entry.slug)
            return (
              <li key={entry.slug} className="relative pb-3">
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${entry.title}, ${shortAuthor(entry.author)}, ${STATUS_WORD[entry.status]}`}
                  onPointerEnter={() => setHover(entry)}
                  onFocus={() => setHover(entry)}
                  onBlur={() => setHover(null)}
                  onClick={() => select(entry)}
                  className={cn(
                    "block cursor-pointer transition-[transform,opacity,filter] duration-300 ease-[cubic-bezier(0.2,1.4,0.4,1)] hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                    on && "-translate-y-3",
                    dim && "opacity-20 grayscale",
                  )}
                >
                  <Cover
                    entry={entry}
                    className={cn("shadow-[0_10px_24px_-14px_rgb(0_0_0/0.55)]", on && "ring-2 ring-primary ring-offset-4 ring-offset-background")}
                    style={{ height: `calc(var(--h) * ${HEIGHT[entry.kind]})` }}
                  />
                </button>
                {/* The board under each cover and its gap, in dots. */}
                <span
                  aria-hidden="true"
                  className="absolute right-[calc(var(--gap)*-1)] bottom-0 left-0 h-2 bg-[radial-gradient(circle,var(--muted-foreground)_30%,transparent_36%)] bg-[length:8px_8px] opacity-50"
                />
              </li>
            )
          })}
        </ul>

        {/* The topics as the shelf's legend, then what and in which order. */}
        <div className="mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-3 font-mono text-sm">
          {(Object.keys(libraryTopics) as TopicId[]).map((id) => {
            const on = parsed.topic === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setUrl({ query: setToken(query, "topic", on ? undefined : id) })}
                className={cn("pill transition-opacity", parsed.topic && !on && "opacity-45")}
                data-tone={TOPIC_TONE[id]}
              >
                {libraryTopics[id].label.toLowerCase()} <span className="opacity-60">{counts[id] ?? 0}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-sm text-muted-foreground">
          <span className="flex flex-wrap items-center justify-center gap-x-3">
            {STATUSES.map((s) => (
              <button key={s ?? "all"} type="button" aria-pressed={parsed.status === s} onClick={() => setUrl({ query: setToken(query, "status", s) })} className={option(parsed.status === s)}>
                {s ? STATUS_WORD[s] : "all"}
              </button>
            ))}
          </span>
          <span className="text-muted-foreground/40" aria-hidden="true">
            /
          </span>
          <span className="flex items-center gap-x-3">
            {SORTS.map((s) => (
              <button key={s} type="button" aria-pressed={sort === s} onClick={() => setUrl({ sort: s })} className={option(sort === s)}>
                {SORT_WORD[s]}
              </button>
            ))}
          </span>
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground/70">
          a cover develops as i read it: dots = up next · half = reading now
        </p>
      </section>

      {/* The open piece. */}
      {selected && (
        <section key={selected.slug} className="mx-auto mt-16 max-w-[48rem] motion-safe:animate-reveal-up">
          <div className="grid gap-8 rounded-3xl border border-border bg-background/80 p-6 backdrop-blur-sm md:grid-cols-[11rem_1fr] md:p-10">
            <a href={selected.url} target="_blank" rel="noreferrer" className="mx-auto block w-36 md:w-full" aria-label={`open ${selected.title}`}>
              <Cover entry={selected} className="shadow-[0_18px_40px_-20px_rgb(0_0_0/0.6)]" />
            </a>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-6">
                <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: TONE_INK[TOPIC_TONE[selected.topic]] }} />
                  {selected.callNumber.toLowerCase()} · {libraryTopics[selected.topic].label.toLowerCase()}
                </p>
                <button
                  type="button"
                  onClick={() => setUrl({ open: null })}
                  className="-m-2 cursor-pointer p-2 font-mono text-sm text-muted-foreground hover:text-foreground"
                  aria-label="close"
                >
                  ✕
                </button>
              </div>
              <h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-0.01em] lowercase md:text-4xl">
                {selected.title.toLowerCase()}
              </h2>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                {selected.author.toLowerCase()} · {metaLine(selected)}
              </p>
              <EntryNotes entry={selected} className="mt-6 border-t border-border/60 pt-6" />
            </div>
          </div>
        </section>
      )}

      {/* The same shelf as a list. */}
      <section className="mx-auto mt-24 max-w-[64rem]" aria-labelledby="catalogue">
        <h2 id="catalogue" className={cn(sectionLabel, "text-center")}>
          the catalogue
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-x-12 font-mono text-sm md:grid-cols-2">
          {shelf
            .filter((e) => matches.has(e.slug))
            .map((entry) => (
              <li key={entry.slug} id={entry.callNumber} className="min-w-0 scroll-mt-28 border-b border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    select(entry)
                    scrollPage(0)
                  }}
                  onPointerEnter={() => setHover(entry)}
                  onPointerLeave={() => setHover(null)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 py-2.5 text-left transition-colors hover:text-foreground",
                    selected?.slug === entry.slug ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Cover entry={entry} className="w-6 shrink-0 rounded-[2px] [&_span]:text-[0px]" />
                  <span className="min-w-0 flex-1 truncate">{entry.title.toLowerCase()}</span>
                  <span className="shrink-0 text-xs tabular-nums opacity-70">{shortAuthor(entry.author).toLowerCase()}</span>
                </button>
              </li>
            ))}
        </ol>
      </section>
    </main>
  )
}
