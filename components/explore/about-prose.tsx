"use client"

import type { ReactNode } from "react"

import { AestudioLogo, FluentLogo, OratoresLogo } from "@/components/brand-marks"
import { experienceContent } from "@/content/experience"
import { useLanguage } from "@/components/language-provider"
import { formatPeriod } from "@/lib/format-date"

// "me" on the home page: what I do right now, as a short list (each place
// with its logo, a link where it has a site, a few words and its dates),
// then one line for everything else I've done.
const LOGOS: Record<string, ReactNode> = {
  aestudio: <AestudioLogo />,
  "Oratores Novi": <OratoresLogo />,
  "Fluent Academy": <FluentLogo />,
}

export function AboutProse() {
  const { language } = useLanguage()
  const t = experienceContent[language]
  const now = t.experiences.filter((exp) => exp.brief)

  return (
    <div className="mt-6">
      <p className="text-muted-foreground lowercase">{t.now}</p>
      <ul className="mt-4 space-y-3">
        {now.map((exp) => {
          const name = (
            <span className="whitespace-nowrap">
              {LOGOS[exp.company]}
              {exp.company}
            </span>
          )
          return (
            <li key={exp.company} className="lowercase">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-xl tracking-[-0.01em]">
                  {exp.companyHref ? (
                    <a
                      href={exp.companyHref}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-border decoration-1 underline-offset-[6px] transition-colors hover:decoration-primary"
                    >
                      {name}
                    </a>
                  ) : (
                    name
                  )}
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {formatPeriod(exp.start, exp.end, language, t.present)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{exp.brief}</p>
            </li>
          )
        })}
      </ul>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground lowercase">{t.also}</p>
    </div>
  )
}
