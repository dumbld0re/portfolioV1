"use client"

import Image from "next/image"
import { useState } from "react"

import { things, thingsContent, type ThingKind } from "@/content/things"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { column } from "@/lib/styles"
import { cn } from "@/lib/utils"

const KINDS: ThingKind[] = ["play", "listen", "carry"]
// Columns the zoom steps through; "+" means bigger things, so fewer columns.
const MIN_COLS = 2
const MAX_COLS = 6

// /things: the heading like /posts, then a row of filter pills that stays up
// top while the grid scrolls under it, blurred. Each thing is a cut-out photo
// floating on the page with only its name under it. Bottom centre (wide
// screens): − reset + to change how many fit on a row.
export function ThingsSection() {
  const { language } = useLanguage()
  const t = thingsContent[language]
  const [kind, setKind] = useState<ThingKind | "all">("all")
  // null: the responsive default (2 / 3 / 4 columns by width).
  const [cols, setCols] = useState<number | null>(null)

  const shown = kind === "all" ? things : things.filter((x) => x.kind === kind)
  const step = (d: number) =>
    setCols((c) => Math.min(MAX_COLS, Math.max(MIN_COLS, (c ?? 4) + d)))

  const filters: { id: ThingKind | "all"; label: string; count: number }[] = [
    { id: "all", label: t.all, count: things.length },
    ...KINDS.map((k) => ({ id: k, label: t.kinds[k], count: things.filter((x) => x.kind === k).length })),
  ]

  return (
    <main className="flex-1 px-6 md:px-12 pt-14 pb-24 md:pt-20 md:pb-32 short:pt-8">
      <div className={column}>
        <header>
          <h1 className="font-serif text-4xl lowercase leading-tight tracking-[-0.02em] md:text-5xl">
            {siteCopy[language].nav.things}
          </h1>
          <p className="mt-3 text-muted-foreground">{t.tagline}</p>
        </header>

        {/* The pills stay put; things slide under a soft blur on the way up. */}
        <div className="things-bar sticky top-0 z-20 -mx-6 mt-10 px-6 pb-6 pt-4 md:-mx-12 md:px-12">
          <div role="tablist" className="flex flex-wrap gap-1.5 font-mono text-[13px]">
            {filters.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={kind === f.id}
                onClick={() => setKind(f.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 transition-colors",
                  kind === f.id
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                <sup className="ml-1 text-[9px] opacity-60">{f.count}</sup>
              </button>
            ))}
          </div>
        </div>

        <ul
          key={kind}
          className={cn("things-grid grid gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-14", !cols && "grid-cols-2 md:grid-cols-3 xl:grid-cols-4")}
          style={cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
        >
          {shown.map((thing, i) => (
            <li key={thing.id} className="thing group" style={{ animationDelay: `${i * 45}ms` }}>
              <div className="relative grid aspect-square place-items-center">
                <div
                  className="thing-img relative"
                  style={{ width: `${(thing.fill ?? 0.8) * 100}%`, height: `${(thing.fill ?? 0.8) * 100}%` }}
                >
                  <Image
                    src={thing.image}
                    alt={thing.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-contain"
                    priority={i < 4}
                  />
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-foreground/80 transition-colors group-hover:text-foreground">
                {thing.name}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 font-mono text-xs lg:flex print:hidden"
        aria-label="zoom"
      >
        <button
          onClick={() => step(1)}
          disabled={cols === MAX_COLS}
          aria-label={t.zoomOut}
          className="grid size-8 place-items-center rounded-full bg-secondary/85 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground disabled:opacity-40"
        >
          −
        </button>
        <button
          onClick={() => setCols(null)}
          disabled={cols === null}
          className="h-8 rounded-full bg-secondary/85 px-3 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground disabled:opacity-40"
        >
          {t.reset}
        </button>
        <button
          onClick={() => step(-1)}
          disabled={cols === MIN_COLS}
          aria-label={t.zoomIn}
          className="grid size-8 place-items-center rounded-full bg-secondary/85 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground disabled:opacity-40"
        >
          +
        </button>
      </div>
    </main>
  )
}
