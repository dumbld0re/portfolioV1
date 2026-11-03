"use client"

import { experienceContent, type ExperienceItem } from "@/content/experience"
import { siteCopy } from "@/content/site"
import { ExperienceOverlap } from "@/components/experience-overlap"
import { useLanguage } from "@/components/language-provider"
import { formatPeriod, monthEnd, monthStart } from "@/lib/format-date"
import { column, inlineLink, measure, sectionLabel } from "@/lib/styles"
import { useActiveIndex } from "@/lib/use-active-index"
import { cn } from "@/lib/utils"

export function ExperienceSection() {
  const { language } = useLanguage()
  const labels = siteCopy[language]
  const t = experienceContent[language]
  // Ongoing roles first (latest start on top), then finished ones (latest end
  // on top). The list and the chart share this order, so one index points at
  // the same role in both.
  const current = t.experiences.filter((exp) => !exp.end).sort((a, b) => monthStart(b.start) - monthStart(a.start))
  const past = t.experiences
    .filter((exp) => exp.end)
    .sort((a, b) => monthEnd(b.end!) - monthEnd(a.end!) || monthStart(b.start) - monthStart(a.start))
  const ordered = [...current, ...past]
  const { active, bind } = useActiveIndex(ordered.length)

  const group = (title: string, items: ExperienceItem[], offset: number, compact = false) => (
    <div>
      <p className="flex items-center gap-4 font-mono text-sm lowercase text-muted-foreground">
        {title}
        <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
      </p>
      <ol className={cn("mt-8", compact ? "space-y-7" : "space-y-10")}>
        {items.map((exp, j) => {
          const i = offset + j
          return (
            <li
              key={exp.company + exp.start}
              {...bind(i)}
              className="grid gap-x-8 gap-y-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline"
            >
              <p
                className={cn(
                  "font-mono text-sm lowercase text-muted-foreground transition-colors duration-300",
                  i === active && "lg:text-primary",
                )}
              >
                {formatPeriod(exp.start, exp.end, language, t.present)}
              </p>
              <div className="space-y-1.5">
                <h3
                  className={cn(
                    "font-serif leading-snug tracking-[-0.01em]",
                    compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl",
                  )}
                >
                  {exp.role}
                </h3>
                <p className={cn("text-foreground/85", !compact && "text-lg")}>
                  {exp.companyHref ? (
                    <a href={exp.companyHref} target="_blank" rel="noreferrer" className={inlineLink}>
                      {exp.company} ↗
                    </a>
                  ) : (
                    exp.company
                  )}
                </p>
                {exp.description && (
                  <p className={cn("leading-relaxed text-muted-foreground", !compact && "text-lg")}>{exp.description}</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )

  return (
    <section id="experience" className="scroll-mt-10 px-6 md:px-12 py-24 md:py-32">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>{labels.nav.experience}</h2>
        <p className="mt-6 font-serif text-5xl lowercase leading-tight tracking-[-0.02em] md:text-7xl">
          {t.title}
          <span className="text-primary">.</span>
        </p>

        <div className="mt-14 flex flex-col gap-14 lg:grid lg:grid-cols-[minmax(0,48rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <div className={`${measure} space-y-16`}>
            {current.length > 0 && group(t.current, current, 0)}
            {past.length > 0 && group(t.past, past, current.length, true)}
          </div>

          {/* Above the list on small screens, pinned beside it on wide ones. */}
          <aside className={`${measure} order-first lg:order-none`}>
            <div className="lg:sticky lg:top-24">
              <ExperienceOverlap experiences={ordered} active={active} present={t.present} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
