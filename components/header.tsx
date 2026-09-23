"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FileText, Github, Mail } from "lucide-react"

import { siteCopy } from "@/content/site"
import { rememberLanguage, useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { BoringToggle } from "@/components/boring-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { localizePath, stripLanguage } from "@/lib/i18n"
import { hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function Header() {
  const { language, localize } = useLanguage()
  const pathname = stripLanguage(usePathname())
  const otherLanguage = language === "de" ? "en" : "de"
  const labels = siteCopy[language]
  const [boot] = useState(() => !hasBootPlayed())

  useEffect(() => {
    markBootPlayed()
  }, [])

  const getFilePath = () => {
    if (pathname === "/cv") return "/home/danny-miguel/cv"
    if (pathname.startsWith("/posts")) return "/home/danny-miguel/posts"
    return "/home/danny-miguel/"
  }

  // Underline sweeps in from the left on hover and stays under the current page.
  const navLink =
    "relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 aria-[current=page]:text-foreground aria-[current=page]:after:scale-x-100"
  const iconButton = "size-8 md:size-9 text-muted-foreground hover:text-foreground"

  return (
    <header className="relative md:sticky md:top-0 z-30 w-full px-6 py-4 md:py-6 md:px-12 lg:px-16 bg-background/80 backdrop-blur-sm border-b border-border/40 print:hidden">
      <nav
        className={cn(
          "flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 max-w-7xl mx-auto",
          boot && "motion-safe:animate-reveal-up",
        )}
      >
        <Link
          href={localize("/")}
          className="font-mono text-sm md:text-base text-foreground/80 hover:text-foreground transition-colors flex items-center gap-3 min-w-0"
        >
          <span className="font-bold text-base md:text-lg whitespace-nowrap">
            dm
            <span className="text-primary motion-safe:animate-caret-blink" aria-hidden="true">
              _
            </span>
          </span>
          <span className="text-muted-foreground/50" aria-hidden="true">
            |
          </span>
          <span className="truncate">{getFilePath()}</span>
        </Link>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
          {/* One row on phones too: scrolls sideways instead of wrapping. */}
          <div className="-mx-6 flex gap-x-5 overflow-x-auto whitespace-nowrap px-6 py-1 [scrollbar-width:none] md:mx-0 md:gap-x-6 md:overflow-visible md:px-0">
            <Link href={localize("/#projects")} className={navLink}>
              {labels.nav.projects}
            </Link>
            <Link href={localize("/#experience")} className={navLink}>
              {labels.nav.experience}
            </Link>
            <Link href={localize("/#contact")} className={navLink}>
              {labels.nav.contact}
            </Link>
            <Link href={localize("/cv")} className={navLink} aria-current={pathname === "/cv" ? "page" : undefined}>
              {labels.nav.cv}
            </Link>
            <Link
              href={localize("/posts")}
              className={navLink}
              aria-current={pathname.startsWith("/posts") ? "page" : undefined}
            >
              {labels.nav.posts}
            </Link>
          </div>

          <div className="flex items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-5 md:gap-6">
              <span className="hidden md:inline text-muted-foreground/50" aria-hidden="true">
                |
              </span>
              <Link
                href={localizePath(otherLanguage, pathname)}
                onClick={() => rememberLanguage(otherLanguage)}
                // A prefetch would run before the click stores the cookie, and
                // proxy.ts could answer it with a redirect back to this language.
                prefetch={false}
                hrefLang={otherLanguage}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                aria-label={otherLanguage === "en" ? "EN — switch to English" : "DE — auf Deutsch wechseln"}
              >
                {otherLanguage.toUpperCase()}
              </Link>
              <BoringToggle />
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              <Button variant="ghost" size="icon" className={iconButton} asChild>
                <a href="https://github.com/dumbld0re" target="_blank" rel="noreferrer">
                  <Github className="size-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className={iconButton} asChild>
                <a href="mailto:dannymiiguel@gmail.com">
                  <Mail className="size-4" />
                  <span className="sr-only">E-Mail</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className={iconButton} asChild>
                <a href="/cv.pdf" download>
                  <FileText className="size-4" />
                  <span className="sr-only">Download {labels.nav.cv}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
