"use client"

import { projectsContent } from "@/content/projects"
import { useLanguage } from "@/components/language-provider"

export function ProjectsSection() {
  const { language } = useLanguage()
  const t = projectsContent[language]

  return (
    <main className="flex-1 px-6 py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="font-mono text-4xl md:text-5xl font-bold uppercase">{t.title}</h1>
          <p className="text-muted-foreground text-lg">{t.description}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {t.projects.map((project, index) => (
            <div
              key={project.title + index}
              className="space-y-4 p-6 border border-border rounded-lg hover:border-foreground/20 transition-colors"
            >
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className="text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="text-xs font-mono px-3 py-1 bg-foreground/5 border border-border rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

