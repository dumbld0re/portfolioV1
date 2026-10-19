"use client"

import type React from "react"
import { ArrowUpRight, Download, Printer } from "lucide-react"

import { cvContent } from "@/content/cv"
import { useLanguage } from "@/components/language-provider"
import { Magnetic } from "@/components/magnetic"
import { RollText } from "@/components/roll-text"
import { SplitChars } from "@/components/split-chars"

// One CV block: a hairline that draws in, the label on the left, content on
// the right. The 3/9 split also holds on paper (A4 is wider than md).
function CvBlock({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <section data-reveal className="relative grid gap-6 md:grid-cols-12 md:gap-x-6 py-12 md:py-16 print:py-5 print:break-inside-avoid">
      <span aria-hidden="true" className="line-draw absolute inset-x-0 top-0 h-px bg-border" />
      <h2 className="md:col-span-3 font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
        <span className="text-primary">({String(index).padStart(2, "0")})</span> {title}
      </h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  )
}

export function CvSection() {
  const { language } = useLanguage()
  const t = cvContent[language]

  const pill =
    "group inline-flex items-center gap-2 rounded-full border px-5 py-3 font-mono text-label uppercase tracking-[0.2em] transition-colors duration-300"
  const contactLink =
    "relative w-fit transition-colors hover:text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"

  return (
    <main className="flex-1 px-6 md:px-12 lg:px-16 pt-12 md:pt-20 pb-16 print:p-0">
      <div className="mx-auto max-w-[90rem]">
        <header className="space-y-10 pb-12 md:pb-16 print:space-y-3 print:pb-5">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h1 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground motion-safe:animate-reveal-up">
              <span className="text-primary">005</span> / {t.label}
            </h1>
            <div className="flex flex-wrap gap-3 print:hidden motion-safe:animate-reveal-up" style={{ animationDelay: "500ms" }}>
              <Magnetic>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className={`${pill} border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary`}
                >
                  <Printer className="size-3.5" />
                  <RollText>{t.exportLabel}</RollText>
                </button>
              </Magnetic>
              <Magnetic>
                <a href="/cv.pdf" download className={`${pill} border-border text-foreground hover:border-foreground`}>
                  <Download className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                  <RollText>{t.downloadLabel}</RollText>
                </a>
              </Magnetic>
            </div>
          </div>

          <p className="font-serif leading-[0.9] tracking-[-0.035em] text-[clamp(3rem,1rem+8vw,10rem)] print:text-4xl print:tracking-tight">
            <SplitChars text={t.name} delay={150} />
          </p>

          <div
            className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm text-muted-foreground motion-safe:animate-reveal-up"
            style={{ animationDelay: "700ms" }}
          >
            <a href={`mailto:${t.email}`} className={contactLink}>
              {t.email}
            </a>
            <a href={`tel:${t.phone.replace(/\s+/g, "")}`} className={contactLink}>
              {t.phone}
            </a>
            <a href={`https://${t.website}`} target="_blank" rel="noreferrer" className={contactLink}>
              {t.website}
            </a>
          </div>
        </header>

        <CvBlock index={1} title={t.profileTitle}>
          <p className="max-w-4xl font-serif text-[clamp(1.375rem,1rem+1.4vw,2.5rem)] leading-[1.2] tracking-[-0.01em] text-balance print:font-sans print:text-sm print:leading-relaxed print:text-muted-foreground">
            {t.profile}
          </p>
        </CvBlock>

        <CvBlock index={2} title={t.experienceTitle}>
          <ol className="space-y-12 print:space-y-4">
            {t.experience.map((entry) => (
              <li key={entry.title} className="group space-y-3 print:space-y-1 print:break-inside-avoid">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 print:text-base print:font-sans print:font-semibold">
                    {entry.title}
                  </h3>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors group-hover:text-primary">
                    {entry.period}
                  </span>
                </div>
                {entry.org &&
                  (entry.orgHref ? (
                    <a
                      href={entry.orgHref}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-1 text-sm text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                    >
                      {entry.org}
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/link:rotate-45 print:hidden" />
                    </a>
                  ) : (
                    <p className="text-sm text-primary">{entry.org}</p>
                  ))}
                <ul className="max-w-3xl space-y-1.5 text-muted-foreground leading-relaxed print:text-sm">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet} className="relative pl-5">
                      <span aria-hidden="true" className="absolute left-0 text-primary/60">
                        ›
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </CvBlock>

        <CvBlock index={3} title={t.educationTitle}>
          <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 print:gap-y-3">
            {t.education.map((entry) => (
              <li key={entry.title} className="group space-y-1.5">
                <h3 className="font-serif text-xl md:text-2xl leading-snug transition-colors group-hover:text-primary print:text-sm print:font-sans print:font-semibold">
                  {entry.title}
                </h3>
                <p className="text-sm text-foreground/80">{entry.detail}</p>
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {entry.place} · {entry.period}
                </p>
              </li>
            ))}
          </ol>
        </CvBlock>

        <CvBlock index={4} title={t.skillsTitle}>
          <dl className="grid gap-x-6 gap-y-8 sm:grid-cols-2 print:gap-y-3">
            {t.skills.map((skill) => (
              <div key={skill.name} className="space-y-2 print:space-y-0.5">
                <dt className="font-mono text-label uppercase tracking-[0.2em] text-primary">{skill.name}</dt>
                <dd className="text-muted-foreground leading-relaxed print:text-sm">{skill.items}</dd>
              </div>
            ))}
          </dl>
        </CvBlock>
      </div>
    </main>
  )
}
