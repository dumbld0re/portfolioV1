"use client"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"

const PLACEHOLDER_COUNT = 4

export function ProjectsSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]

  return (
    <section id="projects" className="scroll-mt-20 px-6 py-20 md:py-28">
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-primary">002</span> / {labels.nav.projects}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-lg border border-dashed border-border bg-card/40 flex items-center justify-center"
            >
              <span className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground/60">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
