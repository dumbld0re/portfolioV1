"use client"

import { Fragment, type ReactNode } from "react"

import { AestudioLogo, OratoresLogo } from "@/components/brand-marks"
import { experienceContent } from "@/content/experience"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { formatPeriod } from "@/lib/format-date"
import { column, sectionLabel } from "@/lib/styles"
import { cn } from "@/lib/utils"

// Experience, told rather than listed: two paragraphs in the display serif.
// Each role stands out in the text colour (a link where there's a site), with
// its dates raised beside it in small mono, and its logo before it where
// there is one.
const LOGOS: Record<string, ReactNode> = {
  aestudio: <AestudioLogo />,
  "Oratores Novi": <OratoresLogo />,
}
export function ExperienceSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = experienceContent[language]
  const byCompany = new Map(t.experiences.map((exp) => [exp.company, exp]))

  return (
    <section id="experience" className="scroll-mt-10 px-6 md:px-12 py-16 md:py-32">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>{labels.nav.experience}</h2>
        <p className="mt-6 font-serif text-5xl lowercase leading-tight tracking-[-0.02em] md:text-7xl">
          {t.title}
          <span className="text-primary">.</span>
        </p>

        <div className="mt-14 max-w-[68rem] space-y-10">
          {t.prose.map((paragraph, p) => (
            <p
              key={p}
              className={cn(
                "font-serif lowercase tracking-[-0.01em] text-muted-foreground",
                // What's running now reads larger than what came before.
                p === 0 ? "text-3xl leading-[1.35] md:text-[2.75rem] md:leading-[1.3]" : "text-2xl leading-[1.4] md:text-3xl",
              )}
            >
              {paragraph.map((part, i) => {
                if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>
                const exp = byCompany.get(part.company)
                if (!exp) return null
                const words = (part.text ?? exp.company).split(" ")
                const last = words.pop()
                const name = (
                  <>
                    {LOGOS[exp.company]}
                    {words.length > 0 && `${words.join(" ")} `}
                    {/* The dates stay on the line of the word before them, so
                        a line never starts with a date. Inline-block keeps a
                        link's underline off them. */}
                    <span className="whitespace-nowrap">
                      {last}
                      <sup className="ml-1.5 inline-block font-mono text-[11px] lowercase tracking-normal text-muted-foreground md:ml-2 md:text-[13px]">
                        {formatPeriod(exp.start, exp.end, language, t.present)}
                      </sup>
                    </span>
                  </>
                )
                return (
                  <span key={i} className="text-foreground">
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
                )
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
