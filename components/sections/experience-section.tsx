"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { experienceContent } from "@/content/experience"
import { useLanguage } from "@/components/language-provider"

export function ExperienceSection() {
  const { language } = useLanguage()
  const t = experienceContent[language]

  return (
    <section id="experience" className="scroll-mt-20 px-6 md:px-12 lg:px-16 py-24 md:py-36">
      <div className="mx-auto max-w-[90rem] grid gap-14 md:grid-cols-12 md:gap-x-6">
        {/* Sticky column: label, title and the skills list ride along. */}
        <aside className="md:col-span-4 md:sticky md:top-32 md:self-start space-y-10">
          <h2 data-reveal className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">003</span> / {t.title}
          </h2>
          <p data-reveal className="font-serif lowercase text-[clamp(2.75rem,1.5rem+4vw,6rem)] leading-[0.9] tracking-[-0.03em]">
            {t.title}
            <span className="text-primary">.</span>
          </p>
          <div data-reveal className="space-y-4">
            <h3 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">{t.skills.title}</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm">
              {t.skills.items.map((item) => (
                <li key={item} className="text-foreground/80 transition-colors hover:text-primary">
                  <span className="text-primary/60" aria-hidden="true">
                    ›{" "}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <ol className="md:col-span-8 md:col-start-5 border-t border-border/60">
          {t.experiences.map((exp, index) => (
            <li
              key={exp.company + index}
              data-reveal
              className="group relative grid grid-cols-[2.5rem_1fr] md:grid-cols-8 gap-x-6 gap-y-2 py-10"
            >
              <span aria-hidden="true" className="line-draw absolute inset-x-0 bottom-0 h-px bg-border/60" />
              <span className="font-mono text-xs text-muted-foreground pt-2 md:col-span-1 transition-colors group-hover:text-primary">
                ({String(index + 1).padStart(2, "0")})
              </span>
              <div className="md:col-span-5 space-y-3">
                <h3 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.01em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                  {exp.role}
                </h3>
                <p className="text-foreground/80">
                  {exp.companyHref ? (
                    <Link
                      href={exp.companyHref}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-1 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
                    >
                      {exp.company}
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/link:rotate-45" />
                    </Link>
                  ) : (
                    exp.company
                  )}
                </p>
                <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
              </div>
              <span className="col-start-2 md:col-start-auto md:col-span-2 md:text-right font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground md:pt-3">
                {exp.period}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
