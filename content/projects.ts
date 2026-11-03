import type { Language } from "@/lib/i18n"

export type ProjectStatus = "inDevelopment" | "inUse"

/** A screenshot in public/. Width and height are the file's pixel size. */
export type Screen = {
  src: string
  width: number
  height: number
  /** Names the screen in its card's path: ~/projects/<slug>/<name>. */
  name?: string
}

export type ProjectPreview =
  /**
   * One card per screen, each shown whole at its own shape. Phone captures
   * stand side by side; wide ones stack, and the later ones only show when
   * there is room for them on screen.
   */
  | { kind: "screens"; screens: Screen[] }
  /** For tools without a UI: a short terminal session. */
  | { kind: "terminal"; lines: string[] }

export type Project = {
  preview: ProjectPreview
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
  internalTool?: boolean
  status?: ProjectStatus
}

// Personal and engineering work only. All web design and client work (sites,
// case studies) lives on aestudio, which the "æ design studio" entry links to.

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
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/finance-tracker-home.webp", width: 1170, height: 2532, name: "home" },
            { src: "/projects/finance-tracker-insights.webp", width: 1170, height: 2532, name: "insights" },
          ],
        },
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
          "Mein Designstudio, die Website dazu habe ich von Grund auf selbst gebaut. Alle meine Webdesign- und Kundenprojekte, samt Case Studies, findest du dort.",
        tech: ["Next.js", "TypeScript", "Canvas", "CSS"],
        demoHref: "https://www.aestudio.site/",
        demoKind: "site",
        githubHref: "https://github.com/dumbld0re/ae",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/ae-home.webp", width: 2880, height: 1800, name: "home" },
            { src: "/projects/ae-contact.webp", width: 2880, height: 1800, name: "contact" },
          ],
        },
        status: "inUse",
      },
    ],
  },
  en: {
    heading: "selected work",
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
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/finance-tracker-home.webp", width: 1170, height: 2532, name: "home" },
            { src: "/projects/finance-tracker-insights.webp", width: 1170, height: 2532, name: "insights" },
          ],
        },
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
          "My design studio, and its site, built from scratch. All my web design and client work, case studies included, lives there.",
        tech: ["Next.js", "TypeScript", "Canvas", "CSS"],
        demoHref: "https://www.aestudio.site/",
        demoKind: "site",
        githubHref: "https://github.com/dumbld0re/ae",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/ae-home.webp", width: 2880, height: 1800, name: "home" },
            { src: "/projects/ae-contact.webp", width: 2880, height: 1800, name: "contact" },
          ],
        },
        status: "inUse",
      },
    ],
  },
}
