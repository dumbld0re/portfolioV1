import type { Language } from "@/lib/i18n"

export type ProjectStatus = "inDevelopment" | "inUse"

export type ProjectPreview =
  /** A screenshot in public/, redrawn as dots beside the list. */
  | { kind: "image"; src: string }
  /** For tools without a UI: a short terminal session. */
  | { kind: "terminal"; lines: string[] }

export type Project = {
  preview?: ProjectPreview
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

// Illustrative only — swap in a real session from the CLI.
const UNI_SESSION = [
  "$ uni build worksheets/praeteritum.typ",
  "  compiling student version …",
  "  ✓ praeteritum.pdf",
  "  compiling answer key …",
  "  ✓ praeteritum-loesungen.pdf",
]

export const projectsContent: Record<
  Language,
  {
    heading: string
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
    heading: "ausgewählte projekte",
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
          "Eine Finanz-App für Einnahmen, Ausgaben und Sparziele, die auch offline funktioniert – fürs Handy gemacht, aber auf allen Geräten synchron.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
        preview: { kind: "image", src: "/projects/finance-tracker.webp" },
        internalTool: true,
        status: "inUse",
      },
      {
        slug: "uni",
        title: "uni — Werkzeugkasten für Nachhilfe & Studium",
        tagline:
          "Ein Kommandozeilen-Tool, das aus einer einzigen Typst-Datei das Arbeitsblatt und das passende Lösungsblatt erzeugt.",
        description:
          "Ein typisiertes Python-CLI für meinen Deutsch-Nachhilfeunterricht und mein Studium.",
        tech: ["Python", "typer", "Typst", "pytest"],
        preview: { kind: "terminal", lines: UNI_SESSION },
        internalTool: true,
        status: "inDevelopment",
      },
      {
        slug: "ae",
        title: "æ design studio",
        description:
          "Die Website meines Designstudios – von Grund auf selbst gebaut, ganz ohne Templates.",
        tech: ["Next.js", "TypeScript", "Canvas", "CSS"],
        demoHref: "https://www.aestudio.site/",
        demoKind: "site",
        githubHref: "https://github.com/dumbld0re/ae",
        preview: { kind: "image", src: "/projects/ae.webp" },
        status: "inUse",
      },
      { title: "", description: "", tech: [], comingSoon: true },
    ],
  },
  en: {
    heading: "selected work",
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
          "An offline-first app for tracking income, expenses, and savings goals – made for mobile, but syncs across devices.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
        preview: { kind: "image", src: "/projects/finance-tracker.webp" },
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
        preview: { kind: "terminal", lines: UNI_SESSION },
        internalTool: true,
        status: "inDevelopment",
      },
      {
        slug: "ae",
        title: "æ design studio",
        description:
          "The site for my design studio, built from scratch with no templates.",
        tech: ["Next.js", "TypeScript", "Canvas", "CSS"],
        demoHref: "https://www.aestudio.site/",
        demoKind: "site",
        githubHref: "https://github.com/dumbld0re/ae",
        preview: { kind: "image", src: "/projects/ae.webp" },
        status: "inUse",
      },
      { title: "", description: "", tech: [], comingSoon: true },
    ],
  },
}
