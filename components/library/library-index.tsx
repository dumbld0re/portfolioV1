"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { IndexLine } from "@/components/library/index-line"
import { ReadingLedger } from "@/components/library/reading-ledger"
import { useLibraryUrl, type LibraryUrlState } from "@/components/library/use-library-url"
import { libraryTopics, type TopicId } from "@/content/library-topics"
import { SORTS, filterEntries, groupEntries, parseQuery, setToken } from "@/lib/library-query"
import type { LibraryEntry } from "@/lib/library-types"
import { cn } from "@/lib/utils"

const SORT_LABELS = { "a-z": "a–z", date: "date", length: "length", topic: "topic" } as const

// Lines slide to their new places when the sort or a topic toggle changes.
// Not on keystrokes: a transition freezes the page into a snapshot, which
// would make typing feel laggy. Boring mode and reduced motion skip it.
function withTransition(update: () => void) {
  const animate =
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !document.documentElement.classList.contains("boring")
  if (!animate) return update()
  document.startViewTransition(() => flushSync(update))
}

export function LibraryIndex({ entries, now }: { entries: LibraryEntry[]; now: string }) {
  const [{ query, sort, open }, setUrl] = useLibraryUrl()
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => filterEntries(entries, query), [entries, query])
  const matches = useMemo(() => new Set(filtered.map((entry) => entry.slug)), [filtered])
  const groups = useMemo(() => groupEntries(filtered, sort), [filtered, sort])
  const shown = groups.reduce((sum, group) => sum + group.entries.length, 0)
  const activeTopic = parseQuery(query).topic

  // "/" jumps to the filter from anywhere on the page, like most docs sites.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (event.key !== "/" || event.metaKey || event.ctrlKey || target.closest("input, textarea, [contenteditable]")) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const animated = (next: Partial<LibraryUrlState>) => withTransition(() => setUrl(next))

  // A ledger glyph opens its entry, clearing a filter that would hide it.
  const selectFromLedger = (entry: LibraryEntry) => {
    flushSync(() => setUrl({ open: entry.callNumber, ...(matches.has(entry.slug) ? {} : { query: "" }) }))
    document.getElementById(entry.callNumber)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const toggleTopic = (topic: TopicId) =>
    animated({ query: setToken(query, "topic", activeTopic === topic ? undefined : topic) })

  return (
    <section className="space-y-10" aria-labelledby="index-heading">
      <div className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="index-heading" className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">007</span> / Index
          </h2>
          <p className="font-mono text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {shown === entries.length ? `${entries.length} entries` : `${shown} of ${entries.length}`}
          </p>
        </div>

        <ReadingLedger
          entries={entries}
          matches={matches}
          now={now}
          highlighted={highlighted}
          onHighlight={setHighlighted}
          onSelect={selectFromLedger}
        />

        <label className="group/filter flex items-center gap-3 rounded-lg border border-border bg-card/60 px-4 py-3 font-mono text-sm transition-colors focus-within:border-primary/60">
          <span className="text-primary select-none" aria-hidden="true">
            &gt;
          </span>
          <span className="text-muted-foreground select-none">filter:</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setUrl({ query: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setUrl({ query: "" })
                event.currentTarget.blur()
              }
            }}
            placeholder="title, author, topic:ai, status:reading, <15m"
            aria-label="Filter the index"
            spellCheck={false}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none caret-primary [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd className="hidden sm:inline-flex rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground group-focus-within/filter:hidden">
            /
          </kbd>
        </label>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm" role="group" aria-label="Topics">
            {(Object.keys(libraryTopics) as TopicId[]).map((id) => {
              const topic = libraryTopics[id]
              const active = activeTopic === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTopic(id)}
                  className={cn(
                    "inline-flex items-center gap-2 transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-1.5 rounded-full transition-transform duration-300", active && "scale-150")}
                    style={{ background: topic.color }}
                  />
                  {topic.label.toLowerCase()}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3 font-mono text-sm" role="group" aria-label="Sort by">
            <span className="text-muted-foreground/60">sort:</span>
            {SORTS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={sort === option}
                onClick={() => animated({ sort: option })}
                className={cn(
                  "relative transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-primary after:transition-transform after:duration-300",
                  sort === option
                    ? "text-foreground after:scale-x-100"
                    : "text-muted-foreground hover:text-foreground after:scale-x-0",
                )}
              >
                {SORT_LABELS[option]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-muted-foreground">
          grep: no entries match <span className="text-foreground">&ldquo;{query.trim()}&rdquo;</span>
          <span aria-hidden="true" className="ml-1 text-primary motion-safe:animate-caret-blink">
            ▍
          </span>
        </p>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.key} style={{ viewTransitionName: `group-${group.key.replace(/[^a-z0-9-]/gi, "_")}` }}>
              <h3 className="flex items-center gap-4 pb-2">
                {group.topic && (
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{ background: libraryTopics[group.topic].color }}
                  />
                )}
                <span className={cn("font-serif text-primary", sort === "a-z" ? "text-heading" : "text-xl")}>
                  {group.label}
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{group.entries.length}</span>
              </h3>
              <ul>
                {group.entries.map((entry) => (
                  <IndexLine
                    key={entry.slug}
                    entry={entry}
                    open={open === entry.callNumber}
                    highlighted={highlighted === entry.slug}
                    onToggle={() => setUrl({ open: open === entry.callNumber ? null : entry.callNumber })}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
