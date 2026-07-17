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
          "Eine persönliche Finanz-App zum Verfolgen von Einnahmen, Ausgaben und Sparzielen – offline-first, mit optionaler geräteübergreifender Synchronisierung.",
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
          "Persönliches Ops-Monorepo für Deutsch-Nachhilfe und Studium. Ein typisiertes Python-CLI verwaltet zwei Typst-Template-Familien; Lückentext-Übungen kompilieren aus einer Quelle per Flag zum Arbeitsblatt- oder Lösungs-PDF. Schülerdaten liegen als Markdown mit YAML-Frontmatter, eine Variablen-Kaskade füllt Templates automatisch.",
        tech: ["Python 3.12", "typer", "Typst", "uv", "pytest", "mypy (strict)"],
        internalTool: true,
        status: "inDevelopment",
      },
      {
        slug: "ae",
        title: "æ design studio",
        tagline: "Mein persönliches Designstudio.",
        description:
          "Die einseitige Website für æ, mein Designstudio. Von Grund auf gebaut – keine Templates, kein CSS-Framework.",
        tech: ["Next.js", "TypeScript", "Canvas", "CSS"],
        demoHref: "https://aenu.vercel.app/",
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
          "A personal finance app for tracking income, expenses, and savings goals — offline-first, with optional cross-device sync.",
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
          "Personal ops monorepo for my German tutoring work and university coursework. A typed Python CLI manages two Typst template families; gap-fill exercises compile from a single source into a worksheet or answer-key PDF via a flag. Student data lives in markdown with YAML frontmatter, and a variable cascade fills templates automatically.",
        tech: ["Python 3.12", "typer", "Typst", "uv", "pytest", "mypy (strict)"],
        internalTool: true,
        status: "inDevelopment",
      },
      {
        slug: "ae",
        title: "æ design studio",
        tagline: "My personal design studio.",
        description:
          "The one-page site for æ, my design studio. Built from scratch — no templates, no CSS framework.",
        tech: ["Next.js", "TypeScript", "Canvas", "CSS"],
        demoHref: "https://aenu.vercel.app/",
        demoKind: "site",
        githubHref: "https://github.com/dumbld0re/ae",
        status: "inUse",
      },
      { title: "", description: "", tech: [], comingSoon: true },
    ],
  },
}
