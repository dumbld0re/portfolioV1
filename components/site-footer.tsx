"use client"

import Link from "next/link"
import { useState } from "react"

import { BoringToggle } from "@/components/boring-toggle"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitch } from "@/components/language-switch"
import { LastUpdated } from "@/components/last-updated"
import { siteCopy } from "@/content/site"
import { motionOff } from "@/lib/eggs"
import { scrollPage } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const quiet = "w-fit transition-colors hover:text-foreground"
/** A taller tap area on touch screens, without moving the text. */
const tap = "-my-2 py-2 lg:my-0 lg:py-0"

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
    if (year !== null || motionOff()) return
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
        "flex flex-col gap-4 border-t border-border/60 pt-6 font-mono text-sm text-muted-foreground lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8",
        className,
      )}
    >
      {/* Wide screens: one row of four. Below that, three tidy rows, each
          split left and right: what the site says, where to go, and the
          controls. */}
      <div className="flex flex-col gap-2 lg:contents">
        <p className="text-balance">
          <button type="button" onClick={timeTravel} className="cursor-pointer tabular-nums transition-colors hover:text-foreground">
            {year === null ? stamp : stamp.replace(/\d+/, String(year))}
          </button>{" "}
          {note.join(" ")}
        </p>
        <LastUpdated />
      </div>
      <div className="flex items-baseline justify-between gap-x-8 lg:contents">
        <Link href={localize("/dont-click-here")} className={cn(quiet, tap)}>
          {copy.dontClickHere}
        </Link>
        <button type="button" onClick={() => scrollPage(0)} className={cn(quiet, tap, "cursor-pointer")}>
          {copy.backToTop}
          <span className="text-primary" aria-hidden="true">
            {" "}
            ↑
          </span>
        </button>
      </div>
      <div className="flex items-center justify-between gap-x-8 border-t border-border/60 pt-4 lg:hidden">
        <BoringToggle />
        <span className="-mr-2 flex items-center">
          <LanguageSwitch showCurrent className={cn(quiet, "-my-3 px-2 py-3")} currentClassName="px-2" />
        </span>
      </div>
    </div>
  )
}
