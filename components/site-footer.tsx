"use client"

import Link from "next/link"
import { useState } from "react"

import { BoringToggle } from "@/components/boring-toggle"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitch } from "@/components/language-switch"
import { LastUpdated } from "@/components/last-updated"
import { siteCopy } from "@/content/site"
import { motionOff } from "@/lib/eggs"
import { markFound } from "@/lib/secrets"
import { SecretsCount } from "@/components/secrets-count"
import { scrollPage } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const quiet = "w-fit transition-colors hover:text-foreground"
/** A 44px tap area on touch screens, without moving the text. */
const tap = "-my-3 py-3 lg:my-0 lg:py-0"
/** A footer label never breaks inside itself. */
const whole = "inline-block whitespace-nowrap"

// The last line of every page: the copyright joke, when the site last
// changed and who has seen it, the link nobody should click, and a way back
// up. Phones and tablets also get the boring toggle and the languages here
// (wide screens have them in the corner, components/corner-controls.tsx).
export function SiteFooter({ className }: { className?: string }) {
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

  return (
    <div
      data-site-footer
      className={cn(
        "flex flex-col items-center gap-4 border-t border-border/60 pt-6 text-center font-mono text-sm text-muted-foreground lg:flex-row lg:flex-wrap lg:justify-between lg:gap-x-8 lg:text-left",
        className,
      )}
    >
      {/* Wide screens: one row of four. Below that, centred rows under the
          page's centre line: what the site says, where to go, the controls. */}
      <div className="flex flex-col items-center gap-2 lg:contents">
        <p className="text-balance">
          <button type="button" onClick={timeTravel} className="cursor-pointer tabular-nums transition-colors hover:text-foreground">
            {year === null ? stamp : stamp.replace(/\d+/, String(year))}
          </button>{" "}
          {note.join(" ")}
        </p>
        <LastUpdated />
      </div>
      {/* Phones: the three links centred on one row, wrapping to a second
          centred row where a language's labels are too long for one. The
          secrets list opens centred over this row. */}
      <div className="relative flex flex-wrap items-baseline justify-center gap-x-6 gap-y-5 lg:contents">
        {/* Wide screens keep these two together as one of the row's four. */}
        <span className="contents lg:flex lg:items-baseline lg:gap-x-8">
          <Link href={localize("/dont-click-here")} className={cn(quiet, tap, whole)}>
            {copy.dontClickHere}
          </Link>
          <SecretsCount className="whitespace-nowrap max-lg:static" buttonClassName={cn(tap, whole)} />
        </span>
        <button type="button" onClick={() => scrollPage(0)} className={cn(quiet, tap, whole, "cursor-pointer")}>
          {copy.backToTop}
          <span className="text-primary" aria-hidden="true">
            {" "}
            ↑
          </span>
        </button>
      </div>
      <div className="flex items-center justify-center gap-x-8 lg:hidden">
        <BoringToggle />
        <span className="flex items-center">
          <LanguageSwitch className={cn(quiet, "-my-3 px-2 py-3")} currentClassName="px-2" />
        </span>
      </div>
    </div>
  )
}
