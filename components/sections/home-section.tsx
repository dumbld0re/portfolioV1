"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"

import { homeContent } from "@/content/home"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { GhostName } from "@/components/ghost-name"
import { Button } from "@/components/ui/button"
import { BOOT_SEQUENCE_MS, hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function HomeSection() {
  const { language } = useLanguage()
  const t = homeContent[language].hero
  const copy = siteCopy[language]
  const [boot] = useState(() => !hasBootPlayed())

  useEffect(() => {
    markBootPlayed()
  }, [])

  const reveal = boot ? "motion-safe:animate-reveal-up" : undefined
  const delay = (key: keyof typeof BOOT_SEQUENCE_MS) =>
    boot ? { animationDelay: `${BOOT_SEQUENCE_MS[key]}ms` } : undefined

  return (
    <>
      <GhostName text={t.name.split(/\s/)[0]} />

      <section className="relative min-h-[calc(100svh-9rem)] flex items-center px-6">
        <div className="relative max-w-3xl w-full mx-auto space-y-6 py-16">
          <div className="space-y-4">
            <p
              className={cn("font-mono text-label uppercase tracking-[0.3em] text-primary", reveal)}
              style={delay("heroKicker")}
            >
              {t.role}
            </p>
            <h1
              className={cn("font-serif text-display font-semibold tracking-tight text-balance", reveal)}
              style={delay("heroName")}
            >
              {t.name}
            </h1>
            <div
              className={cn("flex items-center gap-3 text-muted-foreground text-sm md:text-base", reveal)}
              style={delay("heroSubtitle")}
            >
              <span className="w-6 h-px bg-primary" aria-hidden="true" />
              <span>{t.subtitle}</span>
            </div>
          </div>

          <div className={cn("space-y-2 text-sm text-muted-foreground", reveal)} style={delay("heroMeta")}>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{t.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-accent-green" />
              <span>{t.status}</span>
            </div>
          </div>
        </div>

        <div
          className={cn("absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3", reveal)}
          style={delay("heroScroll")}
        >
          <span className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">{copy.scroll}</span>
          <span className="w-px h-8 bg-foreground/30 motion-safe:animate-pulse" />
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">001</span> / {t.introLabel}
          </h2>

          <p className="font-serif text-2xl md:text-3xl leading-snug font-medium max-w-2xl text-balance">{t.intro}</p>

          <div className="md:grid md:grid-cols-5 md:gap-8">
            <div className="hidden md:block md:col-span-2" />
            <div className="md:col-span-3 border-l border-border pl-6 text-muted-foreground leading-relaxed">
              <p>{t.description}</p>
            </div>
          </div>

          <Button asChild size="lg">
            <Link href="#contact">{t.cta}</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
