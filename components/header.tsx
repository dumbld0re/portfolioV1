"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { siteCopy } from "@/content/site"
import { CvMenu } from "@/components/cv-menu"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitch } from "@/components/language-switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { SHOW_POSTS } from "@/lib/features"
import { stripLanguage } from "@/lib/i18n"
import { hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { cn } from "@/lib/utils"

// A quiet row of lowercase links on the right edge of the home frame. It scrolls away with the page;
// the boring toggle and friends live in the corners (components/corner-controls.tsx).
export function Header() {
  const { language, localize } = useLanguage()
  const pathname = stripLanguage(usePathname())
  const labels = siteCopy[language]
  const [boot] = useState(() => !hasBootPlayed())

  useEffect(() => {
    markBootPlayed()
  }, [])

  // Underline sweeps in from the left on hover and stays under the current page.
  // On phones each link gets a taller (and the short ones a wider) invisible
  // tap area; the negative margins keep the visible spacing the same.
  const navLink =
    "relative -my-3 py-3 md:my-0 md:py-0 lowercase text-muted-foreground transition-colors hover:text-foreground after:absolute after:inset-x-0 after:bottom-2 md:after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 aria-[current=page]:text-foreground aria-[current=page]:after:scale-x-100"

  const links = [
    { href: "/#projects", label: labels.nav.projects },
    { href: "/#experience", label: labels.nav.experience },
    { href: "/#contact", label: labels.nav.contact },
    ...(SHOW_POSTS ? [{ href: "/posts", label: labels.nav.posts, current: pathname.startsWith("/posts") }] : []),
  ]

  return (
    <header className="relative z-30 w-full px-6 md:px-12 pt-5 pb-4 md:pt-12 short:pt-6! print:hidden">
      <nav
        className={cn(
          "mx-auto flex max-w-[90rem] items-center gap-x-4 font-mono text-[13px] md:justify-end md:gap-x-8 md:text-base",
          boot && "motion-safe:animate-reveal-up",
        )}
      >
        {/* One row on every width: on narrow phones the links scroll sideways
            under the language and theme controls instead of wrapping. */}
        <div className="-my-3 flex min-w-0 flex-1 gap-x-3.5 overflow-x-auto py-3 whitespace-nowrap [scrollbar-width:none] md:-my-2 md:flex-none md:gap-x-8 md:overflow-visible md:py-2">
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
        {/* "Lebenslauf" is too long for the one-row phone bar; "cv" reads in both languages. */}
        <CvMenu className={cn(navLink, "-mx-2 cursor-pointer px-2 after:inset-x-2 aria-expanded:text-foreground aria-expanded:after:scale-x-100 md:mx-0 md:px-0 md:after:inset-x-0")}>
          <span className="md:hidden">cv</span>
          <span className="hidden md:inline">{labels.nav.cv}</span>
        </CvMenu>
        </div>

        <span className="flex shrink-0 items-center gap-x-3">
          <span className="hidden text-muted-foreground/40 md:inline" aria-hidden="true">
            /
          </span>
          <LanguageSwitch className={cn(navLink, "-mx-2 px-2 after:inset-x-2 md:mx-0 md:px-0 md:after:inset-x-0")} />
          <ThemeToggle />
        </span>
      </nav>
    </header>
  )
}
