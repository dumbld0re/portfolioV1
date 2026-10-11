import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { BoringToggle } from "@/components/boring-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { SITE_URL } from "@/lib/seo"

// The portfolio header's terminal-path look, trimmed to what the library needs:
// its own path, a way back to the main site, and the two display toggles.
export function LibraryHeader() {
  return (
    <header className="relative md:sticky md:top-0 z-30 w-full px-6 py-4 md:py-6 md:px-12 lg:px-16 bg-background/80 backdrop-blur-sm border-b border-border/40 print:hidden">
      <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 max-w-7xl mx-auto motion-safe:animate-reveal-up">
        <Link
          href="/"
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
          <span className="truncate">/home/danny-miguel/library</span>
        </Link>

        <div className="flex items-center gap-5 md:gap-6">
          <a
            href={SITE_URL}
            className="group inline-flex items-center gap-1 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            dannymiguel.com
            <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <BoringToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
