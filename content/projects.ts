import type { Language } from "@/lib/i18n"

export type ProjectStatus = "inDevelopment" | "inUse"

export type Project = {
  /** Rendered as a terminal-style path header: ~/projects/<slug> */
  slug?: string
  title: string
  tagline?: string
  description: string
  tech: string[]
  demoHref?: string
  /** Which label the demoHref button uses. Defaults to "demo". */
  demoKind?: "demo" | "site"
  githubHref?: string
  comingSoon?: boolean
  internalTool?: boolean
  status?: ProjectStatus
}

export const projectsContent: Record<
  Language,
  {
    comingSoonLabel: string
    viewDemoLabel: string
    viewSiteLabel: string
    viewSourceLabel: string
    internalToolLabel: string
    statusLabels: Record<ProjectStatus, string>
    projects: Project[]
  }
> = {
  de: {
    comingSoonLabel: "Demnächst",
    viewDemoLabel: "Demo ansehen",
    viewSiteLabel: "Website ansehen",
    viewSourceLabel: "Quellcode",
    internalToolLabel: "Internes Tool",
    statusLabels: {
      inDevelopment: "In Entwicklung",
      inUse: "Im Einsatz",
    },
    projects: [
      {
        slug: "finance-tracker",
        title: "Finance Tracker",
        description:
          "Eine Offline-first-Finanz-App für Einnahmen, Ausgaben und Sparziele.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
        internalTool: true,
        status: "inUse",
      },
      {
        slug: "uni",
        title: "uni — Nachhilfe- & Studiums-Ops-Suite",
        tagline:
          "Ein CLI, das aus einer Typst-Quelle sowohl ein Arbeitsblatt als auch den Lösungsschlüssel erzeugt.",
        description:
          "Ein typisiertes Python-CLI für meine Deutsch-Nachhilfe und mein Studium.",
        tech: ["Python", "typer", "Typst", "pytest"],
        internalTool: true,
        status: "inDevelopment",
      },
      {
        slug: "ae",
        title: "æ design studio",
        description:
          "Die Website meines Designstudios, von Grund auf ohne Templates gebaut.",
        tech: ["Next.js", "TypeScript", "Canvas", "CSS"],
        demoHref: "https://aestudio.site/",
        demoKind: "site",
        githubHref: "https://github.com/dumbld0re/ae",
        status: "inUse",
      },
      { title: "", description: "", tech: [], comingSoon: true },
    ],
  },
  en: {
    comingSoonLabel: "Coming soon",
    viewDemoLabel: "View demo",
    viewSiteLabel: "View site",
    viewSourceLabel: "View source",
    internalToolLabel: "Internal tool",
    statusLabels: {
      inDevelopment: "In development",
      inUse: "In use",
    },
    projects: [
      {
        slug: "finance-tracker",
        title: "Finance Tracker",
        description:
          "An offline-first app for tracking income, expenses, and savings goals.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
        internalTool: true,
        status: "inUse",
      },
      {
        slug: "uni",
        title: "uni — tutoring & coursework ops suite",
        tagline:
          "A CLI that turns one Typst source into both a student worksheet and its answer key.",
        description:
          "A typed Python CLI for my German tutoring and university coursework.",
        tech: ["Python", "typer", "Typst", "pytest"],
        internalTool: true,
        status: "inDevelopment",
      },
      {
        slug: "ae",
        title: "æ design studio",
        description:
          "The site for my design studio, built from scratch with no templates.",
        tech: ["Next.js", "TypeScript", "Canvas", "CSS"],
        demoHref: "https://aestudio.site/",
        demoKind: "site",
        githubHref: "https://github.com/dumbld0re/ae",
        status: "inUse",
      },
      { title: "", description: "", tech: [], comingSoon: true },
    ],
  },
}
