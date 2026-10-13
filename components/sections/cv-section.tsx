"use client"

import { Download, Printer } from "lucide-react"

import { cvContent } from "@/content/cv"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function CvSection() {
  const { language } = useLanguage()
  const t = cvContent[language]

  return (
    <main className="flex-1 px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-6">
          <h1 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">005</span> / {t.label}
          </h1>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <p className="font-serif text-heading font-semibold tracking-tight">{t.name}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm text-muted-foreground">
                <a href={`mailto:${t.email}`} className="transition-colors hover:text-foreground">
                  {t.email}
                </a>
                <a href={`tel:${t.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-foreground">
                  {t.phone}
                </a>
                <a
                  href={`https://${t.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  {t.website}
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 print:hidden">
              <Button
                size="lg"
                onClick={() => window.print()}
                className="px-3 text-xs font-mono font-bold uppercase tracking-wide shadow-lg shadow-primary/30 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/40 sm:px-6 sm:text-sm"
              >
                <Printer className="size-4" />
                {t.exportLabel}
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-primary px-3 text-xs font-mono font-bold uppercase tracking-wide text-primary transition-all hover:scale-[1.03] hover:bg-primary hover:text-primary-foreground sm:px-6 sm:text-sm"
              >
                <a href="/cv.pdf" download>
                  <Download className="size-4" />
                  {t.downloadLabel}
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-8">
          <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">{t.profileTitle}</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">{t.profile}</p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 border-t border-border pt-8">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
                {t.educationTitle}
              </h2>
              <div className="space-y-6">
                {t.education.map((entry) => (
                  <div key={entry.title} className="space-y-1">
                    <h3 className="font-semibold leading-snug">{entry.title}</h3>
                    <p className="text-sm text-primary">{entry.detail}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.place} · {entry.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">{t.skillsTitle}</h2>
              <div className="space-y-4">
                {t.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <h3 className="font-semibold text-sm">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{skill.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
                {t.experienceTitle}
              </h2>
              <div className="space-y-8">
                {t.experience.map((entry) => (
                  <div key={entry.title} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h3 className="font-semibold">{entry.title}</h3>
                      <span className="font-mono text-sm text-muted-foreground shrink-0">{entry.period}</span>
                    </div>
                    {entry.org &&
                      (entry.orgHref ? (
                        <a
                          href={entry.orgHref}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                          {entry.org}
                        </a>
                      ) : (
                        <p className="text-sm text-primary">{entry.org}</p>
                      ))}
                    <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc pl-4">
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
