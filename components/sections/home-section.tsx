"use client"

import { MapPin } from "lucide-react"

import { homeContent } from "@/content/home"
import { useLanguage } from "@/components/language-provider"
import { Typewriter } from "@/components/typewriter"

export function HomeSection() {
  const { language } = useLanguage()
  const t = homeContent[language].hero

  return (
    <main className="flex-1 flex items-start md:items-center justify-center px-6 pt-4 pb-10 md:py-8">
      <div className="max-w-3xl w-full space-y-6">
        <div className="space-y-3">
          <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold md:whitespace-nowrap">
            <Typewriter text={t.name} delay={100} />
          </h1>
          <div className="flex items-center gap-3 text-muted-foreground text-sm md:text-base font-mono">
            <span className="text-foreground">|</span>
            <span>{t.subtitle}</span>
          </div>
        </div>

        <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl">
          <p>{t.intro}</p>
          <p>{t.description}</p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>{t.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span>{t.status}</span>
          </div>
        </div>
      </div>
    </main>
  )
}

