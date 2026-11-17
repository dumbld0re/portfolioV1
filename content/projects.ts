import type { Language } from "@/lib/i18n"

export type ProjectStatus = "inDevelopment" | "inUse"

/** Large screens in their own panel, or a list of names with a card on the cursor. */
export type ProjectsView = "stage" | "index"

/** A screenshot in public/. Width and height are the file's pixel size. */
export type Screen = {
  src: string
  width: number
  height: number
  /** Names the screen in its image's alt text. */
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
  /** Stable key for the project. */
  slug?: string
  title: string
  /** One short line under the title on the projects list. */
  short?: string
  tagline?: string
  description: string
  tech: string[]
  demoHref?: string
  /** Which label the demoHref button uses. Defaults to "demo". */
  demoKind?: "demo" | "site"
  githubHref?: string
  internalTool?: boolean
  status?: ProjectStatus
  /** A phone capture of a web project, for layouts that show one beside the wide screens. */
  phone?: Screen
  /** More captures for the project's case study, after the preview screens and the phone. */
  gallery?: Screen[]
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
    /** The one muted line under the heading, like the posts page's. */
    tagline: string
    /** Shown on the projects page while it is being reworked. */
    updating: string
    /** The switch between the two layouts: "view: stage / index". */
    viewLabel: string
    views: Record<ProjectsView, string>
    viewDemoLabel: string
    viewSiteLabel: string
    viewSourceLabel: string
    internalToolLabel: string
    /** The hint on a project's picture, the case study's way back, and its link onward. */
    openLabel: string
    backLabel: string
    nextLabel: string
    statusLabels: Record<ProjectStatus, string>
    projects: Project[]
  }
> = {
  de: {
    heading: "ausgewählte projekte",
    tagline: "kleine tools und websites, die ich gebaut habe.",
    updating: "diese seite überarbeite ich gerade. schau bald wieder vorbei.",
    viewLabel: "ansicht",
    views: { stage: "bühne", index: "liste" },
    viewDemoLabel: "Demo ansehen",
    viewSiteLabel: "Website ansehen",
    viewSourceLabel: "Quellcode",
    internalToolLabel: "Internes Tool",
    openLabel: "projekt ansehen",
    backLabel: "projekte",
    nextLabel: "nächstes projekt",
    statusLabels: {
      inDevelopment: "In Entwicklung",
      inUse: "Im Einsatz",
    },
    projects: [
      {
        slug: "fairhour",
        title: "Fairhour",
        short: "die fairste meeting-zeit über zeitzonen hinweg.",
        tagline: "Findet die fairste Uhrzeit für ein Meeting, wenn das Team über Zeitzonen verteilt ist.",
        description:
          "Gerade kam eine neue Schrift raus (Allo, von Josh Puckett), und ich habe mit möglichen künftigen Kollegen in ganz verschiedenen Zeitzonen geschrieben. Statt weiter Uhrzeiten im Kopf umzurechnen, habe ich das hier gebaut: Leute auswählen, und es zeigt die Stunde, die allen am wenigsten abverlangt.",
        tech: ["HTML", "CSS", "JavaScript", "Intl API", "Web Audio"],
        demoHref: "https://fairhour-one.vercel.app/",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/fairhour-home.webp", width: 2880, height: 1800, name: "Startseite" },
            { src: "/projects/fairhour-people.webp", width: 2880, height: 1800, name: "Teilnehmer wählen" },
          ],
        },
        phone: { src: "/projects/fairhour-mobile.webp", width: 1170, height: 2532, name: "Handy" },
        status: "inUse",
      },
      {
        slug: "finance-tracker",
        title: "Finance Tracker",
        short: "ausgaben und ersparnisse im blick, auf allen geräten.",
        description:
          "Eine Finanz-App für Einnahmen, Ausgaben und Sparziele, die auch offline funktioniert – fürs Handy gemacht, aber auf allen Geräten synchron.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/finance-tracker-desktop.webp", width: 2880, height: 1800, name: "Übersicht" },
            { src: "/projects/finance-tracker-desktop-entry.webp", width: 2880, height: 1800, name: "neuer Eintrag" },
          ],
        },
        phone: { src: "/projects/finance-tracker-home.webp", width: 1170, height: 2532, name: "Handy" },
        gallery: [
          { src: "/projects/finance-tracker-desktop-dark.webp", width: 2880, height: 1800, name: "dunkles Design" },
          { src: "/projects/finance-tracker-insights.webp", width: 1170, height: 2532, name: "Monatsauswertung" },
          { src: "/projects/finance-tracker-entry.webp", width: 1170, height: 2532, name: "neuer Eintrag auf dem Handy" },
        ],
        internalTool: true,
        status: "inUse",
      },
      {
        slug: "uni",
        title: "uni — Werkzeugkasten für Nachhilfe & Studium",
        short: "eine typst-datei, ein arbeitsblatt und sein lösungsschlüssel.",
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
        short: "mein designstudio und seine website.",
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
    tagline: "small tools and sites i've built.",
    updating: "i'm currently reworking this page. check back soon.",
    viewLabel: "view",
    views: { stage: "stage", index: "index" },
    viewDemoLabel: "View demo",
    viewSiteLabel: "View site",
    viewSourceLabel: "View source",
    internalToolLabel: "Internal tool",
    openLabel: "view project",
    backLabel: "projects",
    nextLabel: "next project",
    statusLabels: {
      inDevelopment: "In development",
      inUse: "In use",
    },
    projects: [
      {
        slug: "fairhour",
        title: "Fairhour",
        short: "the fairest meeting time across time zones.",
        tagline: "Finds the fairest meeting time for a team spread across time zones.",
        description:
          "A new font had just dropped (Allo, by Josh Puckett), and I'd been messaging potential colleagues in very different time zones. Instead of doing the time maths in my head one more time, I built this: pick who's joining, and it finds the hour that asks the least of everyone.",
        tech: ["HTML", "CSS", "JavaScript", "Intl API", "Web Audio"],
        demoHref: "https://fairhour-one.vercel.app/",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/fairhour-home.webp", width: 2880, height: 1800, name: "home" },
            { src: "/projects/fairhour-people.webp", width: 2880, height: 1800, name: "choosing people" },
          ],
        },
        phone: { src: "/projects/fairhour-mobile.webp", width: 1170, height: 2532, name: "phone" },
        status: "inUse",
      },
      {
        slug: "finance-tracker",
        title: "Finance Tracker",
        short: "spending and savings at a glance, on every device.",
        description:
          "An offline-first app for tracking income, expenses, and savings goals – made for mobile, but syncs across devices.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/finance-tracker-desktop.webp", width: 2880, height: 1800, name: "overview" },
            { src: "/projects/finance-tracker-desktop-entry.webp", width: 2880, height: 1800, name: "new entry" },
          ],
        },
        phone: { src: "/projects/finance-tracker-home.webp", width: 1170, height: 2532, name: "phone" },
        gallery: [
          { src: "/projects/finance-tracker-desktop-dark.webp", width: 2880, height: 1800, name: "dark mode" },
          { src: "/projects/finance-tracker-insights.webp", width: 1170, height: 2532, name: "month view" },
          { src: "/projects/finance-tracker-entry.webp", width: 1170, height: 2532, name: "new entry on the phone" },
        ],
        internalTool: true,
        status: "inUse",
      },
      {
        slug: "uni",
        title: "uni — tutoring & coursework ops suite",
        short: "one typst file, a worksheet and its answer key.",
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
        short: "my design studio and its site.",
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
  it: {
    heading: "progetti scelti",
    tagline: "piccoli strumenti e siti che ho costruito.",
    updating: "sto rifacendo questa pagina. ripassa presto.",
    viewLabel: "vista",
    views: { stage: "palco", index: "elenco" },
    viewDemoLabel: "Vedi la demo",
    viewSiteLabel: "Vai al sito",
    viewSourceLabel: "Codice sorgente",
    internalToolLabel: "Strumento interno",
    openLabel: "vedi progetto",
    backLabel: "progetti",
    nextLabel: "prossimo progetto",
    statusLabels: {
      inDevelopment: "In sviluppo",
      inUse: "In uso",
    },
    projects: [
      {
        slug: "fairhour",
        title: "Fairhour",
        short: "l'orario di riunione più equo tra i fusi orari.",
        tagline: "Trova l'orario più equo per una riunione quando il team è sparso tra fusi orari diversi.",
        description:
          "Era appena uscito un nuovo font (Allo, di Josh Puckett) e stavo scrivendo a possibili futuri colleghi in fusi orari molto diversi. Invece di rifare i conti degli orari a mente, ho costruito questo: scegli chi partecipa e trova l'ora che chiede meno a tutti.",
        tech: ["HTML", "CSS", "JavaScript", "Intl API", "Web Audio"],
        demoHref: "https://fairhour-one.vercel.app/",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/fairhour-home.webp", width: 2880, height: 1800, name: "home" },
            { src: "/projects/fairhour-people.webp", width: 2880, height: 1800, name: "scelta delle persone" },
          ],
        },
        phone: { src: "/projects/fairhour-mobile.webp", width: 1170, height: 2532, name: "telefono" },
        status: "inUse",
      },
      {
        slug: "finance-tracker",
        title: "Finance Tracker",
        short: "spese e risparmi a colpo d’occhio, su ogni dispositivo.",
        description:
          "Un'app per entrate, spese e obiettivi di risparmio che funziona anche offline – pensata per il telefono, ma sincronizzata su tutti i dispositivi.",
        tech: ["React", "Vite", "Vercel Functions", "Upstash Redis"],
        demoHref: "https://financetracker-demo.vercel.app/",
        githubHref: "https://github.com/dumbld0re/financeApp",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/finance-tracker-desktop.webp", width: 2880, height: 1800, name: "panoramica" },
            { src: "/projects/finance-tracker-desktop-entry.webp", width: 2880, height: 1800, name: "nuova voce" },
          ],
        },
        phone: { src: "/projects/finance-tracker-home.webp", width: 1170, height: 2532, name: "telefono" },
        gallery: [
          { src: "/projects/finance-tracker-desktop-dark.webp", width: 2880, height: 1800, name: "tema scuro" },
          { src: "/projects/finance-tracker-insights.webp", width: 1170, height: 2532, name: "vista del mese" },
          { src: "/projects/finance-tracker-entry.webp", width: 1170, height: 2532, name: "nuova voce sul telefono" },
        ],
        internalTool: true,
        status: "inUse",
      },
      {
        slug: "uni",
        title: "uni — kit per ripetizioni e università",
        short: "un file typst, una scheda e le sue soluzioni.",
        tagline:
          "Una CLI che da un unico file Typst genera sia la scheda per lo studente sia le soluzioni.",
        description:
          "Una CLI in Python tipizzato per le mie ripetizioni di tedesco e lo studio universitario.",
        tech: ["Python", "typer", "Typst", "pytest"],
        preview: { kind: "terminal", lines: UNI_SESSION },
        internalTool: true,
        status: "inDevelopment",
      },
      {
        slug: "ae",
        title: "æ design studio",
        short: "il mio studio di design e il suo sito.",
        description:
          "Il mio studio di design, con un sito costruito da zero. Tutti i miei lavori di web design e per clienti, casi studio compresi, sono lì.",
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

/** Every capture a case study shows: preview screens, the phone, then the extras. */
export function projectShots(project: Project): Screen[] {
  const shots: Screen[] = []
  if (project.preview.kind === "screens") shots.push(...project.preview.screens)
  if (project.phone) shots.push(project.phone)
  if (project.gallery) shots.push(...project.gallery)
  return shots.filter((s, i) => shots.findIndex((o) => o.src === s.src) === i)
}

export const projectPath = (slug: string) => `/projects/${slug}`
