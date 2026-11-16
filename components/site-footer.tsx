"use client"

import Link from "next/link"
import { useState } from "react"

import { BoringToggle } from "@/components/boring-toggle"
import { ModeSwitches } from "@/components/corner-controls"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitch } from "@/components/language-switch"
import { LastUpdated } from "@/components/last-updated"
import { siteCopy } from "@/content/site"
import { motionOff } from "@/lib/eggs"
import { markFound } from "@/lib/secrets"
import { SecretsCount } from "@/components/secrets-count"
import { GlobeHorizon } from "@/components/visitor-globe"
import { scrollPage } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const quiet = "w-fit transition-colors hover:text-foreground"
/** A 44px tap area on touch screens, without moving the text. */
const tap = "-my-3 py-3 lg:my-0 lg:py-0"
/** A footer label never breaks inside itself. */
const whole = "inline-block whitespace-nowrap"
/** The frosted pills that float over the globe on phones. */
const floating =
  "inline-flex h-11 items-center rounded-full border border-border/70 bg-background/80 text-muted-foreground shadow-[0_6px_20px_-10px_rgb(0_0_0/0.3)] backdrop-blur-md"

// The last line of every page: the copyright joke, when the site last
// changed and who has seen it, the link nobody should click, and the boring
// and sound switches (all on one row on wide screens). Phones and tablets get
// the boring toggle, the languages and a way back up instead, floating over
// the visitor globe on the home page and in a plain row everywhere else.
export function SiteFooter({ className, globe = false }: { className?: string; globe?: boolean }) {
  const { language, localize } = useLanguage()
  const copy = siteCopy[language]
  // "2086© (so i dont forget…)": the year can be clicked, and then the
  // calendar runs forward to it.
  const [stamp, ...note] = copy.footer.split(" ")
  const [year, setYear] = useState<number | null>(null)

  const timeTravel = () => {
    if (year !== null) return
    markFound("2086")
    if (motionOff()) return
    const from = new Date().getFullYear()
    const to = parseInt(stamp, 10)
    const start = performance.now()
    const run = (now: number) => {
      const p = Math.min(1, (now - start) / 1400)
      setYear(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(run)
      else window.setTimeout(() => setYear(null), 1600)
    }
    requestAnimationFrame(run)
  }

  const yearButton = (
    <button type="button" onClick={timeTravel} className="cursor-pointer tabular-nums transition-colors hover:text-foreground">
      {year === null ? stamp : stamp.replace(/\d+/, String(year))}
    </button>
  )

  // Phones and tablets: boring mode and languages on the left, back to top on
  // the right; floating over the globe on the home page.
  const controls = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className={cn(floating, "px-3.5")}>
          <BoringToggle />
        </span>
        <span className={cn(floating, "px-1.5")}>
          <LanguageSwitch className={cn(quiet, "-my-3 px-2 py-3")} currentClassName="px-2" />
        </span>
      </div>
      <button
        type="button"
        onClick={() => scrollPage(0)}
        aria-label={copy.backToTop}
        className={cn(floating, "size-11 cursor-pointer justify-center text-primary transition-colors hover:text-foreground")}
      >
        ↑
      </button>
    </div>
  )

  return (
    <div data-site-footer className={cn("font-mono text-sm text-muted-foreground", className)}>
      {/* Wide screens: one row of four under a hairline. */}
      <div className="hidden border-t border-border/60 pt-6 lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8">
        <p className="text-balance">
          {yearButton} {note.join(" ")}
        </p>
        <LastUpdated />
        <span className="flex items-baseline gap-x-8">
          <Link href={localize("/dont-click-here")} className={cn(quiet, whole)}>
            {copy.dontClickHere}
          </Link>
          <SecretsCount className="whitespace-nowrap" buttonClassName={whole} />
        </span>
        <span className="flex items-baseline gap-x-6">
          <ModeSwitches className={cn(quiet, whole, "cursor-pointer")} />
        </span>
      </div>

      {/* Phones and tablets: a few quiet centred lines, then the page ends on
          the top of a globe of where visitors come from, rising out of the
          bottom edge with the controls floating over it. */}
      <div className="flex flex-col items-center gap-2.5 text-center lg:hidden">
        <p className="text-balance">
          {yearButton} {note.join(" ")}
        </p>
        <LastUpdated count={false} />
        <div className="relative mt-3 flex flex-wrap items-baseline justify-center gap-x-6 gap-y-5">
          <Link href={localize("/dont-click-here")} className={cn(quiet, tap, whole)}>
            {copy.dontClickHere}
          </Link>
          <SecretsCount className="static whitespace-nowrap" buttonClassName={cn(tap, whole)} />
        </div>
        {globe ? (
          <GlobeHorizon className="mt-10">
            <div className="absolute inset-x-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))]">{controls}</div>
          </GlobeHorizon>
        ) : (
          <div className="mt-10 w-full">{controls}</div>
        )}
      </div>
    </div>
  )
}
