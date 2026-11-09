"use client"

import Link from "next/link"

import { BoringToggle } from "@/components/boring-toggle"
import { useLanguage } from "@/components/language-provider"
import { LastUpdated } from "@/components/last-updated"
import { siteCopy } from "@/content/site"
import { scrollPage } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const quiet = "w-fit transition-colors hover:text-foreground"

// The last line of every page: the copyright joke, when the site last
// changed and who has seen it, the link nobody should click, and a way back
// up. Phones and tablets also get the boring toggle here (wide screens have
// it in the corner, components/corner-controls.tsx).
export function SiteFooter({ className }: { className?: string }) {
  const { language, localize } = useLanguage()
  const copy = siteCopy[language]

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border/60 pt-6 font-mono text-sm text-muted-foreground md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8",
        className,
      )}
    >
      <p>{copy.footer}</p>
      <LastUpdated />
      <Link href={localize("/dont-click-here")} className={quiet}>
        {copy.dontClickHere}
      </Link>
      <button type="button" onClick={() => scrollPage(0)} className={cn(quiet, "cursor-pointer")}>
        {copy.backToTop}
        <span className="text-primary" aria-hidden="true">
          {" "}
          ↑
        </span>
      </button>
      <div className="mt-2 md:mt-0 lg:hidden">
        <BoringToggle />
      </div>
    </div>
  )
}
