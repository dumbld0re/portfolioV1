"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { siteCopy } from "@/content/site"
import { rememberLanguage, useLanguage } from "@/components/language-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { SHOW_POSTS } from "@/lib/features"
import { localizePath, stripLanguage } from "@/lib/i18n"
import { hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { cn } from "@/lib/utils"

// A quiet row of lowercase links on the right edge of the home frame. It scrolls away with the page;
// the boring toggle and friends live in the corners (components/corner-controls.tsx).
export function Header() {
  const { language, localize } = useLanguage()
  const pathname = stripLanguage(usePathname())
  const otherLanguage = language === "de" ? "en" : "de"
  const labels = siteCopy[language]
  const [boot] = useState(() => !hasBootPlayed())

  useEffect(() => {
    markBootPlayed()
  }, [])

  // Underline sweeps in from the left on hover and stays under the current page.
  const navLink =
    "relative lowercase text-muted-foreground transition-colors hover:text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 aria-[current=page]:text-foreground aria-[current=page]:after:scale-x-100"

  const links = [
    { href: "/#projects", label: labels.nav.projects },
    { href: "/#experience", label: labels.nav.experience },
    { href: "/#contact", label: labels.nav.contact },
    { href: "/cv", label: labels.nav.cv, current: pathname === "/cv" },
    ...(SHOW_POSTS ? [{ href: "/posts", label: labels.nav.posts, current: pathname.startsWith("/posts") }] : []),
  ]

  return (
    <header className="relative z-30 w-full px-6 md:px-12 pt-7 pb-4 md:pt-12 print:hidden">
      <nav
        className={cn(
          "mx-auto flex max-w-[90rem] flex-wrap items-center justify-end gap-x-5 gap-y-3 font-mono text-sm md:gap-x-8 md:text-base",
          boot && "motion-safe:animate-reveal-up",
        )}
      >

        {links.map((link) => (
          <Link
            key={link.href}
            href={localize(link.href)}
            className={navLink}
            aria-current={link.current ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}

        <span className="flex items-center gap-x-3">
          <span className="text-muted-foreground/40" aria-hidden="true">
            /
          </span>
          <Link
            href={localizePath(otherLanguage, pathname)}
            onClick={() => rememberLanguage(otherLanguage)}
            // A prefetch would run before the click stores the cookie, and
            // proxy.ts could answer it with a redirect back to this language.
            prefetch={false}
            hrefLang={otherLanguage}
            className={navLink}
            aria-label={otherLanguage === "en" ? "EN — switch to English" : "DE — auf Deutsch wechseln"}
          >
            {otherLanguage}
          </Link>
          <ThemeToggle />
        </span>
      </nav>
    </header>
  )
}
