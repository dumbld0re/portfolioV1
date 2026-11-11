"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { homeContent } from "@/content/home"
import { ParticleText } from "@/components/particle-text"
import { useLanguage } from "@/components/language-provider"
import { setHeroName } from "@/lib/eggs"
import { BOOT_SEQUENCE_MS, hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { SocialLinks } from "@/components/social-links"
import { column } from "@/lib/styles"
import { cn } from "@/lib/utils"

export function HomeSection() {
  const { language } = useLanguage()
  const t = homeContent[language].hero
  const [boot] = useState(() => !hasBootPlayed())

  useEffect(() => {
    markBootPlayed()
  }, [])

  // First load only: each part arrives in turn (app/globals.css, "Motion").
  const block = boot ? "m-block" : undefined
  const delay = (ms: number) => (boot ? ({ "--d": `${ms}ms` } as CSSProperties) : undefined)

  return (
    // Gaps and the name scale with the screen's height as well as its width,
    // so the whole hero (icons included) fits on a laptop screen. data-stage:
    // the area the name's dots can fly, fall and be thrown around in.
    <section data-stage="" className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center px-6 md:px-12 py-[clamp(2rem,5svh,5rem)]">
      <div className={column}>
      <p
        className={cn("font-mono text-sm text-muted-foreground", block)}
        style={delay(BOOT_SEQUENCE_MS.heroName - 100)}
      >
        {t.currently}
      </p>

      {/* The name, in loose dots: they fly in, give way to the cursor and can
          be gathered by a held mouse button (components/particle-text.tsx). */}
      <ParticleText
        ref={(handle) => {
          setHeroName(handle)
          return () => setHeroName(null)
        }}
        lines={t.name.split(/\s+/)}
        accent="-"
        delay={boot ? BOOT_SEQUENCE_MS.heroDots : 0}
        className="mt-[clamp(1.25rem,3.5svh,2rem)] font-serif font-normal lowercase tracking-[-0.02em] text-[min(clamp(3.25rem,1rem+10vw,12rem),19svh)] leading-[1.02]"
      />

      <div className="mt-[clamp(1.5rem,5svh,3rem)] max-w-4xl space-y-5">
        <p
          className={cn("text-xl leading-relaxed text-foreground/90 text-pretty md:text-2xl short:text-xl!", block)}
          style={delay(BOOT_SEQUENCE_MS.heroIntro)}
        >
          {t.intro}
        </p>
        <p
          className={cn("text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl short:text-lg!", block)}
          style={delay(BOOT_SEQUENCE_MS.heroSubtitle)}
        >
          {t.description}
        </p>
      </div>

      <div className={block} style={delay(BOOT_SEQUENCE_MS.heroMeta)}>
        {/* data-hero-links: the corner's "say hello" waits until this row has scrolled away. */}
        <div data-hero-links className="mt-[clamp(1.5rem,5svh,3rem)]">
          <SocialLinks items={["github", "email", "cv", "x"]} />
        </div>
      </div>
      </div>
    </section>
  )
}
