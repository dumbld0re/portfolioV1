"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { homeContent } from "@/content/home"
import { ParticleText } from "@/components/particle-text"
import { HeroStack } from "@/components/sections/hero-copy"
import { useLanguage } from "@/components/language-provider"
import { setHeroName } from "@/lib/eggs"
import { BOOT_SEQUENCE_MS, hasBootPlayed, markBootPlayed } from "@/lib/motion"
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
    // On wide screens the hero fills the first screen and sits in its middle;
    // on phones it takes only the room it needs (a full-height hero left big
    // empty gaps above and below). data-stage: the area the name's dots can
    // fly, fall and be thrown around in. Everything sits on the centre line.
    <section data-stage="" className="relative flex flex-col justify-center px-6 pt-14 pb-4 md:min-h-[calc(100svh-5rem)] md:px-12 md:py-[clamp(2rem,5svh,5rem)]">
      <div className={cn(column, "flex flex-col items-center text-center")}>

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
        className="text-center font-serif font-normal lowercase tracking-[-0.02em] text-[min(clamp(3.25rem,1rem+10vw,12rem),19svh)] leading-[1.02]"
      />

      <div className={cn("mt-[clamp(1rem,3svh,1.75rem)]", block)} style={delay(BOOT_SEQUENCE_MS.heroName - 100)}>
        {/* data-hero-links: the corner's "say hello" waits until this has scrolled away. */}
        <div data-hero-links>
          <HeroStack t={t} />
        </div>
      </div>
      </div>
    </section>
  )
}
