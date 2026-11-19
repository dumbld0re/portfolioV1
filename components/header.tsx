"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitch } from "@/components/language-switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { BackHome } from "@/components/back-home"
import { PROJECTS_LIVE } from "@/lib/features"
import { stripLanguage } from "@/lib/i18n"
import { hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { cn } from "@/lib/utils"

// Every page but home: the way back at the left end, and the same corner as
// the home page on the right (languages and theme, no links: the home
// sentence is the way around). It scrolls away with the page.
export function Header() {
  const { language, localize } = useLanguage()
  const pathname = stripLanguage(usePathname())
  const labels = siteCopy[language]
  const [boot] = useState(() => !hasBootPlayed())

  useEffect(() => {
    markBootPlayed()
  }, [])

  // A post or project goes back to its list; everything else goes home.
  const back = pathname.startsWith("/posts/")
    ? { href: localize("/posts"), label: labels.nav.posts.toLowerCase() }
    : pathname.startsWith("/projects/")
      ? { href: localize("/projects") + (PROJECTS_LIVE ? "" : "?preview"), label: labels.nav.projects.toLowerCase() }
      : { href: localize("/"), label: labels.nav.backHome }

  return (
    <header className="relative z-30 w-full px-6 md:px-12 pt-5 pb-4 md:pt-10 short:pt-6! print:hidden">
      <nav className={cn("mx-auto flex max-w-[90rem] items-center justify-between gap-x-4 font-mono text-sm md:text-base", boot && "m-block")}>
        <BackHome href={back.href} label={back.label} />
        <span className="flex shrink-0 items-center gap-x-4">
          {/* Posts are English-only, so a post has no language switch. */}
          {!pathname.startsWith("/posts/") && (
            <span className="flex items-center gap-x-3 text-muted-foreground">
              <LanguageSwitch className="-my-3 py-3 transition-colors hover:text-foreground" />
            </span>
          )}
          <ThemeToggle />
        </span>
      </nav>
    </header>
  )
}
