"use client"

import { useEffect, useState } from "react"

import { homeContent } from "@/content/home"
import { useLanguage } from "@/components/language-provider"
import { BOOT_SEQUENCE_MS, hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { SocialLinks } from "@/components/social-links"
import { column } from "@/lib/styles"
import { cn } from "@/lib/utils"

const CHAR_STAGGER_MS = 30

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
    <section className="flex min-h-[calc(100svh-5rem)] flex-col justify-center px-6 md:px-12 py-20">
      <div className={column}>
      <p
        className={cn("font-mono text-sm text-muted-foreground", reveal)}
        style={delay(BOOT_SEQUENCE_MS.heroName - 100)}
      >
        {t.location.toLowerCase()} <span className="text-muted-foreground/40">·</span> {t.status}
      </p>

      {/* One name per line; each letter rises out of its own clipping box. */}
      <h1 className="mt-8 font-serif font-normal lowercase leading-[1.02] tracking-[-0.02em] text-[clamp(3.25rem,1rem+8.5vw,8.5rem)]">
        {t.name.split(/\s+/).map((line, li, lines) => (
          <span key={line} className="block">
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

      <div className={cn("mt-12 max-w-2xl space-y-5", reveal)} style={delay(BOOT_SEQUENCE_MS.heroSubtitle)}>
        <p className="text-xl leading-relaxed text-foreground/90 text-pretty md:text-2xl">{t.intro}</p>
        <p className="text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">{t.description}</p>
      </div>

      <div className={reveal} style={delay(BOOT_SEQUENCE_MS.heroMeta)}>
        <SocialLinks items={["github", "email", "cv", "x"]} className="mt-12" />
      </div>
      </div>
    </section>
  )
}
