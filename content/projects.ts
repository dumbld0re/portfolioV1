import type { Language } from "@/lib/i18n"

export type Project = {
  title: string
  description: string
  tech: string[]
  demoHref?: string
  githubHref?: string
  comingSoon?: boolean
}

export const projectsContent: Record<
  Language,
  {
    comingSoonLabel: string
    viewDemoLabel: string
    viewSourceLabel: string
    projects: Project[]
  }
> = {
  de: {
    comingSoonLabel: "Demnächst",
    viewDemoLabel: "Demo ansehen",
    viewSourceLabel: "Quellcode",
    projects: [
      {
        title: "Finance Tracker",
        description:
          "Eine persönliche Finanz-App zum Verfolgen von Einnahmen, Ausgaben und Sparzielen – offline-first, mit optionaler geräteübergreifender Synchronisierung.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
      },
      { title: "", description: "", tech: [], comingSoon: true },
      { title: "", description: "", tech: [], comingSoon: true },
      { title: "", description: "", tech: [], comingSoon: true },
    ],
  },
  en: {
    comingSoonLabel: "Coming soon",
    viewDemoLabel: "View demo",
    viewSourceLabel: "View source",
    projects: [
      {
        title: "Finance Tracker",
        description:
          "A personal finance app for tracking income, expenses, and savings goals — offline-first, with optional cross-device sync.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
      },
      { title: "", description: "", tech: [], comingSoon: true },
      { title: "", description: "", tech: [], comingSoon: true },
      { title: "", description: "", tech: [], comingSoon: true },
    ],
  },
}
