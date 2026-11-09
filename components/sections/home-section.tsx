"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"

import { homeContent } from "@/content/home"
import { HeroPiece } from "@/components/hero-piece"
import { useLanguage } from "@/components/language-provider"
import { BOOT_SEQUENCE_MS, hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { SocialLinks } from "@/components/social-links"
import { column, inlineLink } from "@/lib/styles"
import { cn } from "@/lib/utils"

const CHAR_STAGGER_MS = 30

// On hover the arrow flies off to the top right and a fresh one slides in
// from the bottom left, as if the link had just been sent somewhere.
function OutArrow() {
  const arrow =
    "absolute inset-0 size-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
  return (
    <span aria-hidden="true" className="relative ml-1 inline-block size-[0.8em] overflow-hidden align-[-0.05em] text-primary">
      <ArrowUpRight className={`${arrow} group-hover/out:translate-x-full group-hover/out:-translate-y-full group-focus-visible/out:translate-x-full group-focus-visible/out:-translate-y-full`} />
      <ArrowUpRight className={`${arrow} -translate-x-full translate-y-full delay-75 group-hover/out:translate-x-0 group-hover/out:translate-y-0 group-focus-visible/out:translate-x-0 group-focus-visible/out:translate-y-0`} />
    </span>
  )
}

export function HomeSection() {
  const { language } = useLanguage()
  const t = homeContent[language].hero
  const [boot] = useState(() => !hasBootPlayed())

  useEffect(() => {
    markBootPlayed()
  }, [])

  const reveal = boot ? "motion-safe:animate-reveal-up" : undefined
  const delay = (ms: number) => (boot ? { animationDelay: `${ms}ms` } : undefined)

  let charIndex = 0

  return (
    // Gaps and the name scale with the screen's height as well as its width,
    // so the whole hero (icons included) fits on a laptop screen.
    <section className="flex min-h-[calc(100svh-5rem)] flex-col justify-center px-6 md:px-12 py-[clamp(2rem,5svh,5rem)]">
      <div className={cn(column, "relative")}>
      {/* The free side of the wide hero: the cursor, large, in dots. */}
      <HeroPiece
        className={cn(
          "absolute right-0 top-1/2 hidden w-[min(34vw,64svh,34rem)] -translate-y-1/2 xl:[@media(hover:hover)]:block",
          boot && "motion-safe:animate-page-fade",
        )}
      />
      <p
        className={cn("font-mono text-sm text-muted-foreground", reveal)}
        style={delay(BOOT_SEQUENCE_MS.heroName - 100)}
      >
        {t.currently}
      </p>

      {/* One name per line; each letter rises out of its own clipping box. */}
      <h1 className="mt-[clamp(1.25rem,3.5svh,2rem)] font-serif font-normal lowercase leading-[1.02] tracking-[-0.02em] text-[min(clamp(3.25rem,1rem+8.5vw,8.5rem),14svh)]">
        {/* Screen readers get the name whole, not letter by letter. */}
        <span className="sr-only">{t.name}</span>
        {t.name.split(/\s+/).map((line, li, lines) => (
          <span key={line} aria-hidden="true" className="block">
            {[...line].map((char) => {
              const i = charIndex++
              return (
                <span key={i} className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] align-bottom">
                  <span
                    className={cn("inline-block", boot && "motion-safe:animate-char-rise", char === "-" && "text-primary")}
                    style={boot ? { animationDelay: `${BOOT_SEQUENCE_MS.heroName + i * CHAR_STAGGER_MS}ms` } : undefined}
                  >
                    {char}
                  </span>
                </span>
              )
            })}
            {li === lines.length - 1 && (
              <span className="ml-[0.04em] font-mono text-[0.6em] text-primary motion-safe:animate-caret-blink" aria-hidden="true">
                _
              </span>
            )}
          </span>
        ))}
      </h1>

      <div className={cn("mt-[clamp(1.5rem,5svh,3rem)] max-w-2xl space-y-5", reveal)} style={delay(BOOT_SEQUENCE_MS.heroSubtitle)}>
        <p className="text-xl leading-relaxed text-foreground/90 text-pretty md:text-2xl short:text-xl!">{t.intro}</p>
        <p className="text-xl leading-relaxed text-foreground/90 text-pretty md:text-2xl short:text-xl!">
          {t.now.map((part, i) =>
            typeof part === "string" ? (
              part
            ) : part.href ? (
              <a key={i} href={part.href} target="_blank" rel="noreferrer" className="group/out whitespace-nowrap text-foreground">
                <span className={inlineLink}>{part.label}</span>
                <OutArrow />
              </a>
            ) : (
              <span key={i} className="text-foreground">
                {part.label}
              </span>
            ),
          )}
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl short:text-lg!">{t.description}</p>
      </div>

      <div className={reveal} style={delay(BOOT_SEQUENCE_MS.heroMeta)}>
        {/* data-hero-links: the corner's "say hello" waits until this row has scrolled away. */}
        <div data-hero-links className="mt-[clamp(1.5rem,5svh,3rem)]">
          <SocialLinks items={["github", "email", "cv", "x"]} />
        </div>
      </div>
      </div>
    </section>
  )
}
