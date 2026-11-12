"use client"

import { Fragment, type ReactNode } from "react"

import { AestudioLogo, OratoresLogo } from "@/components/brand-marks"
import { experienceContent } from "@/content/experience"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { formatPeriod } from "@/lib/format-date"
import { TaglineHeading } from "@/components/sections/tagline-heading"
import { column, sectionLabel, taglineHeading } from "@/lib/styles"
import { cn } from "@/lib/utils"

// Experience, told rather than listed: two paragraphs in the display serif.
// Each role stands out in the text colour (a link where there's a site), with
// its dates raised beside it in small mono, and its logo before it where
// there is one.
const LOGOS: Record<string, ReactNode> = {
  aestudio: <AestudioLogo />,
  "Oratores Novi": <OratoresLogo />,
}
/** Keeps hyphenated words ("sign-ups") whole, so a line never ends on "sign-". */
function unbroken(text: string) {
  return text.split(/(\S+-\S+)/).map((bit, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {bit}
      </span>
    ) : (
      bit
    ),
  )
}

export function ExperienceSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = experienceContent[language]
  const byCompany = new Map(t.experiences.map((exp) => [exp.company, exp]))

  return (
    <section id="experience" className="scroll-mt-10 px-6 py-16 md:px-12 md:py-24">
      <div data-reveal className={column}>
      {/* The whole section follows the hero's centre line. */}
      <div className="mx-auto max-w-[42rem] text-center">
        <h2 className={sectionLabel}>{labels.nav.experience}</h2>
        {/* The heading in the hero tagline's voice: "where i have [worked]". */}
        <TaglineHeading text={t.title} pill={t.titlePill} className={taglineHeading} />

        <div className="mt-8 space-y-6 md:space-y-8">
          {t.prose.map((paragraph, p) => (
            <p
              key={p}
              className={cn(
                "font-serif lowercase tracking-[-0.01em] text-muted-foreground text-pretty",
                // What's running now reads larger than what came before.
                p === 0
                  ? "text-[1.375rem] leading-[1.45] md:text-3xl md:leading-[1.4]"
                  : "text-lg leading-[1.55] md:text-[1.375rem] md:leading-[1.5]",
              )}
            >
              {paragraph.map((part, i) => {
                if (typeof part === "string") return <Fragment key={i}>{unbroken(part)}</Fragment>
                const exp = byCompany.get(part.company)
                if (!exp) return null
                const words = (part.text ?? exp.company).split(" ")
                const last = words.pop()
                // The logo stays on the line of the name's first word, so a
                // line never ends on a logo.
                const first = words.shift()
                const logo = LOGOS[exp.company]
                const name = (
                  <>
                    {first !== undefined && (
                      <>
                        <span className="whitespace-nowrap">
                          {logo}
                          {first}
                        </span>{" "}
                      </>
                    )}
                    {words.length > 0 && `${words.join(" ")} `}
                    {/* The dates stay on the line of the word before them, so
                        a line never starts with a date. Inline-block keeps a
                        link's underline off them. */}
                    <span className="whitespace-nowrap">
                      {first === undefined && logo}
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
      </div>
    </section>
  )
}
