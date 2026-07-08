"use client"

import { experienceContent } from "@/content/experience"
import { useLanguage } from "@/components/language-provider"

export function ExperienceSection() {
  const { language } = useLanguage()
  const t = experienceContent[language]

  return (
    <section id="experience" className="scroll-mt-20 px-6 py-20 md:py-28">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <h2 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">003</span> / {t.title}
          </h2>
          <p className="font-serif text-2xl md:text-3xl leading-snug font-medium max-w-2xl text-balance">
            {t.description}
          </p>
        </div>

        <div className="space-y-8">
          {t.experiences.map((exp, index) => (
            <div key={exp.company + index} className="space-y-3 pb-8 border-b border-border last:border-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h3 className="text-xl font-bold">{exp.role}</h3>
                <span className="text-sm text-muted-foreground font-mono">{exp.period}</span>
              </div>
              <p className="text-muted-foreground font-medium">{exp.company}</p>
              <p className="text-muted-foreground">{exp.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 pt-8 border-t border-border">
          <h3 className="text-2xl font-bold">{t.skills.title}</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {t.skills.categories.map((category) => (
              <div key={category.name} className="space-y-3">
                <h4 className="font-bold text-lg">{category.name}</h4>
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
    </section>
  )
}
