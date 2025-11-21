"use client"

import { experienceContent } from "@/content/experience"
import { useLanguage } from "@/components/language-provider"

export function ExperienceSection() {
  const { language } = useLanguage()
  const t = experienceContent[language]

  return (
    <main className="flex-1 px-6 py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="font-mono text-4xl md:text-5xl font-bold uppercase">{t.title}</h1>
          <p className="text-muted-foreground text-lg">{t.description}</p>
        </div>

        <div className="space-y-8">
          {t.experiences.map((exp, index) => (
            <div key={exp.company + index} className="space-y-3 pb-8 border-b border-border last:border-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h2 className="text-xl font-bold">{exp.role}</h2>
                <span className="text-sm text-muted-foreground font-mono">{exp.period}</span>
              </div>
              <p className="text-muted-foreground font-medium">{exp.company}</p>
              <p className="text-muted-foreground">{exp.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold">{t.skills.title}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {t.skills.categories.map((category) => (
              <div key={category.name} className="space-y-3">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="text-sm font-mono px-3 py-1 bg-foreground/5 border border-border rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

