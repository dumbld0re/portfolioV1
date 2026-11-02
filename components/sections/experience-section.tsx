"use client"

import { experienceContent } from "@/content/experience"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { useLanguage } from "@/components/language-provider"
import { column, inlineLink, measure, sectionLabel } from "@/lib/styles"
import { useActiveIndex } from "@/lib/use-active-index"
import { cn } from "@/lib/utils"

export function ExperienceSection() {
  const { language } = useLanguage()
  const t = experienceContent[language]
  const { active, bind } = useActiveIndex(t.experiences.length)

  return (
    <section id="experience" className="scroll-mt-10 px-6 md:px-12 py-24 md:py-32">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>
          {t.title}
        </h2>
        <p className="mt-6 font-serif text-5xl lowercase leading-tight tracking-[-0.02em] md:text-7xl">
          {t.title}
          <span className="text-primary">.</span>
        </p>

        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,48rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <div>
        <ol className={`${measure} space-y-12`}>
          {t.experiences.map((exp, index) => (
            <li
              key={exp.company + index}
              {...bind(index)}
              className={cn("space-y-2 transition-opacity duration-500", index !== active && "lg:opacity-50")}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-serif text-3xl leading-snug md:text-4xl tracking-[-0.01em]">{exp.role}</h3>
                <span className="font-mono text-sm lowercase text-muted-foreground">{exp.period}</span>
              </div>
              <p className="text-lg text-foreground/85">
                {exp.companyHref ? (
                  <a href={exp.companyHref} target="_blank" rel="noreferrer" className={inlineLink}>
                    {exp.company} ↗
                  </a>
                ) : (
                  exp.company
                )}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">{exp.description}</p>
            </li>
          ))}
        </ol>

        <div className={`${measure} mt-14 space-y-4`}>
          <h3 className={sectionLabel}>{t.skills.title}</h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-base text-foreground/80">
            {t.skills.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        </div>

        <aside aria-hidden="true" className="hidden lg:block">
          <div className="sticky top-24">
            <ExperienceTimeline experiences={t.experiences} active={active} />
          </div>
        </aside>
        </div>
      </div>
    </section>
  )
}
