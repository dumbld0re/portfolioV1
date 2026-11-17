"use client"

import { thingsContent } from "@/content/things"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { column } from "@/lib/styles"

// /things, set like /posts and /projects: the heading and one muted line. For
// now that line says it's still being built.
export function ThingsSection() {
  const { language } = useLanguage()

  return (
    <main className="flex-1 px-6 md:px-12 pt-14 pb-24 md:pt-20 md:pb-32 short:pt-8">
      <div className={column}>
        <div className="max-w-2xl">
          <header>
            <h1 className="font-serif text-4xl lowercase leading-tight tracking-[-0.02em] md:text-5xl">
              {siteCopy[language].nav.things}
            </h1>
            <p className="mt-3 text-muted-foreground">{thingsContent[language].tagline}</p>
          </header>
        </div>
      </div>
    </main>
  )
}
