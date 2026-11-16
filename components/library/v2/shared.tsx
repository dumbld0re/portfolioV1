"use client"

import type { ReactNode } from "react"

import { BoringToggle } from "@/components/boring-toggle"
import { DotGround } from "@/components/dot-ground"
import { ThemeToggle } from "@/components/theme-toggle"
import type { TopicId } from "@/content/library-topics"
import { formatMinutes } from "@/lib/library-query"
import type { LibraryEntry } from "@/lib/library-types"
import { scrollPage } from "@/lib/scroll"
import { SITE_URL } from "@/lib/seo"
import { cn } from "@/lib/utils"

// What both library designs share: the main site's frame (dot ground, a quiet
// lowercase bar on the right, a mono footer), the topic colours (the hero's
// pill tones) and how an entry's notes open.

/** Each topic wears one of the hero's pill colours. */
export const TOPIC_TONE: Record<TopicId, "sky" | "coral" | "sun" | "mint" | "grape"> = {
  ai: "sky",
  systems: "coral",
  craft: "sun",
  finance: "mint",
  life: "grape",
}

/** The solid version of each pill colour, for dots and marks. */
export const TONE_INK: Record<(typeof TOPIC_TONE)[TopicId], string> = {
  sky: "#4d94ff",
  coral: "#ff6e46",
  sun: "#f2b600",
  mint: "#2ec27e",
  grape: "#a06eff",
}

export const STATUS_WORD = { read: "read", reading: "reading now", queued: "up next" } as const

const DATE = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

export function shortAuthor(author: string) {
  if (author.includes(" et al.")) return author
  return author
    .split(" & ")
    .map((name) => name.trim().split(/\s+/).at(-1))
    .join(" & ")
}

/** "paper · 45 min · read 20 feb 2026" */
export function metaLine(entry: LibraryEntry) {
  const when =
    entry.status === "read" && entry.finished
      ? `read ${DATE.format(new Date(entry.finished))}`
      : STATUS_WORD[entry.status]
  return [entry.kind, formatMinutes(entry.minutes), when].join(" · ").toLowerCase()
}

/** An entry, opened: the notes in the serif, the source a link away. */
export function EntryNotes({ entry, className }: { entry: LibraryEntry; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {entry.notesHtml ? (
        <div
          className="library-notes font-serif text-lg leading-[1.55] text-muted-foreground lowercase [&_a]:underline [&_p+p]:mt-3"
          dangerouslySetInnerHTML={{ __html: entry.notesHtml }}
        />
      ) : (
        <p className="font-mono text-xs text-muted-foreground">no notes yet.</p>
      )}
      <a
        href={entry.url}
        target="_blank"
        rel="noreferrer"
        className="inline-block font-mono text-sm text-foreground underline decoration-border decoration-1 underline-offset-[5px] transition-colors hover:decoration-primary"
      >
        open the source <span className="text-primary">↗</span>
      </a>
    </div>
  )
}

/** The page around either design. */
export function LibraryFrame({ children }: { children: ReactNode }) {
  const link = "text-muted-foreground transition-colors hover:text-foreground"
  return (
    <div className="site relative flex min-h-screen flex-col bg-background lowercase">
      <DotGround />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="w-full px-6 pt-5 pb-4 md:px-12 md:pt-12 print:hidden">
          <nav className="mx-auto flex max-w-[90rem] items-center justify-end gap-x-6 font-mono text-[13px] md:gap-x-8 md:text-base">
            <a href={SITE_URL} className={link}>
              dannymiguel.com <span className="text-primary">↗</span>
            </a>
            <span className="text-muted-foreground/40" aria-hidden="true">
              /
            </span>
            <ThemeToggle />
          </nav>
        </header>
        {children}
        <footer className="w-full px-6 pt-16 pb-10 md:px-12 print:hidden">
          <div className="mx-auto flex max-w-[90rem] flex-col items-center gap-4 border-t border-border/60 pt-6 text-center font-mono text-sm text-muted-foreground lg:flex-row lg:justify-between lg:text-left">
            <p>2086© (so i dont forget to ever change this)</p>
            <span className="flex items-center gap-8">
              <BoringToggle />
              <button type="button" onClick={() => scrollPage(0)} className={cn(link, "cursor-pointer")}>
                back to top <span className="text-primary">↑</span>
              </button>
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
