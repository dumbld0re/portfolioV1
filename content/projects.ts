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
  /** A capture of one panel with its own edge (a bar widget): no frame, shown
   *  at half its pixel size (it was taken at 2x). */
  bare?: boolean
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
  /** Why I made it. Every project page opens with this, right under the title. */
  why?: string
  description: string
  tech: string[]
  demoHref?: string
  /** Which label the demoHref button uses. Defaults to "demo". */
  demoKind?: "demo" | "site"
  githubHref?: string
  /** One more way out, beside the demo: where to see more of this kind of work. */
  more?: { label: string; href: string }
  internalTool?: boolean
  /** "tools": listed under "internal tools", below the main projects.
   *  "fun": listed under "random cool things", after the internal tools. */
  group?: "tools" | "fun"
  /** No case study page: every link to it opens the demo instead. */
  demoOnly?: boolean
  /** The shell lines that install it, in order, shown on its page. */
  install?: string[]
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
    /** The label over a project's "why", the first thing on its page. */
    whyLabel: string
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
    whyLabel: "warum ich das gebaut habe",
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
        gallery: [{ src: "/projects/fairhour-mobile-people.webp", width: 1170, height: 2532, name: "Teilnehmer wählen" }],
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
        slug: "remote",
        title: "Remote",
        short: "Der Laptop vom Handy aus.",
        tagline:
          "Ich hasste es, jedes Mal aufzustehen, wenn ich pausieren wollte, also habe ich mir eine Website über Tailscale gebaut.",
        description:
          "Eine Fernbedienung auf dem Handy für den Laptop am HDMI. Irgendwo tippen zum Pausieren, ziehen zum Spulen, Lautstärke und Audioausgang wechseln, einen Sleep-Timer stellen. Kein App Store, kein Konto, es läuft auf dem Laptop selbst.",
        tech: ["Python", "Server-Sent Events", "D-Bus", "PipeWire", "Tailscale"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/remote-phones.webp", width: 880, height: 943, bare: true, name: "Laptop und Steuerung" }],
        },
        gallery: [
          { src: "/projects/remote-scrub.webp", width: 1170, height: 2532, name: "Spulen" },
          { src: "/projects/remote-controls.webp", width: 1170, height: 2532, name: "Steuerung" },
          { src: "/projects/remote-session.webp", width: 1170, height: 2532, name: "Sleep-Timer" },
        ],
        internalTool: true,
        group: "tools",
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
        group: "tools",
        status: "inDevelopment",
      },
      {
        slug: "proposal-kit",
        title: "proposal-kit",
        short: "eine farbe rein, eine fertige angebotspalette raus.",
        tagline: "Macht aus einer Farbe eine ganze, kontrastgeprüfte Palette und setzt sie in einen Katalog von Typst-Angebotsvorlagen.",
        why:
          "Bei einem Sponsoring-Angebot kam die Bitte nach „einer Mischung aus dunklen und hellen Tönen“, und ich habe einen Nachmittag lang Brauntöne für drei Layouts von Hand ausgesucht. Solche Angebote werde ich noch oft schreiben, also habe ich gebaut, was ich mir gewünscht hätte: eine Farbe rein, und heraus kommt eine ganze Palette, die auf dem Papier funktioniert und schon in einer Vorlage sitzt.",
        description:
          "Ein Python-CLI ohne Abhängigkeiten. pk palette leitet aus einer einzigen Farbe zwölf Töne in vier Stimmungen ab, nach Regeln, die ich an von Hand abgestimmten Paletten gemessen habe, und prüft jede Kombination auf Kontrast. pk new kopiert eine Vorlage, färbt sie um und erzeugt das PDF; pk view rendert den ganzen Katalog in beliebigen Farben und öffnet ihn im Browser. Kundenarbeit bleibt in einem privaten Ordner, die öffentlichen Vorlagen kommen mit einer erfundenen Marke.",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/proposal-kit-templates.webp", width: 2880, height: 1800, name: "Vorlagen in erzeugten Paletten" },
            { src: "/projects/proposal-kit-gallery.webp", width: 2880, height: 1800, name: "der Katalog im Browser" },
          ],
        },
        phone: { src: "/projects/proposal-kit-mobile.webp", width: 1170, height: 2532, name: "Handy" },
        gallery: [
          { src: "/projects/proposal-kit-palette.webp", width: 2880, height: 1800, name: "eine Farbe, vier Stimmungen" },
          { src: "/projects/proposal-kit-brand.webp", width: 2880, height: 1620, name: "die Beispielmarke" },
        ],
        githubHref: "https://github.com/dumbld0re/proposal-kit",
        install: [
          "git clone https://github.com/dumbld0re/proposal-kit.git",
          "ln -s \"$PWD/proposal-kit/pk.py\" ~/.local/bin/pk",
          "pk view teal",
        ],
        tech: ["Python", "Typst", "OKLCH", "Poppler"],
        internalTool: true,
        group: "tools",
        status: "inUse",
      },
      {
        slug: "localsend-drop",
        title: "LocalSend Drop",
        short: "dateien auf die leiste ziehen, schon landen sie auf dem gerät nebenan.",
        description:
          "Ein Omarchy-Leisten-Widget für LocalSend. Dateien aufs Symbol ziehen, ein Gerät wählen, und sie gehen direkt übers lokale Netz – ohne die LocalSend-App zu öffnen. Darunter steckt ein kleiner LocalSend-Client in reinem Python, ganz ohne Abhängigkeiten.",
        tech: ["QML", "Quickshell", "Python", "LocalSend"],
        githubHref: "https://github.com/dumbld0re/omarchy-localsend-drop",
        install: ["omarchy plugin add https://github.com/dumbld0re/omarchy-localsend-drop.git --enable"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/localsend-drop.webp", width: 872, height: 530, bare: true, name: "Panel" }],
        },
        group: "tools",
        status: "inUse",
      },
      {
        slug: "speed",
        title: "Speed",
        short: "fast.com-speedtests direkt in der leiste.",
        description:
          "Ein Omarchy-Leisten-Widget, das meine letzte Download-Geschwindigkeit zeigt. Ein Klick öffnet Upload, Latenz im Leerlauf und unter Last, eine Bufferbloat-Note und ein Diagramm der letzten Tests. Es nutzt einen eigenen fast.com-Client, in TypeScript auf Bun geschrieben, und testet auf Wunsch nach Zeitplan.",
        tech: ["QML", "Quickshell", "TypeScript", "Bun", "SQLite"],
        githubHref: "https://github.com/dumbld0re/omarchy-speed",
        install: ["omarchy pkg add bun", "omarchy plugin add https://github.com/dumbld0re/omarchy-speed.git --enable"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/speed.webp", width: 822, height: 754, bare: true, name: "Panel" }],
        },
        group: "tools",
        status: "inUse",
      },
      {
        slug: "ae",
        title: "æ design studio",
        short: "mein designstudio und seine website.",
        tagline: "Mein Designstudio und seine Website.",
        description:
          "Von Grund auf selbst gebaut. Alle meine Webdesign- und Kundenprojekte, samt Case Studies, findest du dort.",
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
      {
        slug: "gallery-ways",
        title: "Gallery Ways",
        short: "vier arten, eine galerie zu zeigen.",
        tagline: "Vier Arten, eine Galerie zu zeigen: ein Dock, ein Orbit, ein Barcode und ein Stapel.",
        description:
          "Vier Arten, eine Sammlung von Arbeiten zu durchstöbern. Zwei aus einem Moodboard-Video geliehen, zwei von mir. Hovern, drehen, scrollen oder werfen.",
        tech: ["HTML", "CSS", "JavaScript", "GSAP"],
        demoHref: "/gallery-ways/index.html",
        more: { label: "mehr arbeiten auf aestudio.site", href: "https://aestudio.site" },
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/gallery-ways-orbit.webp", width: 2880, height: 1800, name: "Orbit" },
            { src: "/projects/gallery-ways-barcode.webp", width: 2880, height: 1800, name: "Barcode" },
          ],
        },
        phone: { src: "/projects/gallery-ways-phone.webp", width: 1170, height: 2532, name: "Handy" },
        gallery: [
          { src: "/projects/gallery-ways-globe.webp", width: 2880, height: 1800, name: "Globus" },
          { src: "/projects/gallery-ways-dock.webp", width: 2880, height: 1800, name: "Dock-Leiste" },
          { src: "/projects/gallery-ways-deck.webp", width: 2880, height: 1800, name: "Stapel" },
        ],
        group: "fun",
        demoOnly: true,
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
    whyLabel: "why i made this",
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
        gallery: [{ src: "/projects/fairhour-mobile-people.webp", width: 1170, height: 2532, name: "who's joining" }],
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
        slug: "remote",
        title: "Remote",
        short: "my laptop, from my phone.",
        tagline: "I hated having to stand up every time I wanted to pause, so I made a website over Tailscale.",
        description:
          "A phone remote for the laptop on HDMI. Tap anywhere to pause, drag to scrub, change the volume or the audio output, set a sleep timer. No app store, no account, it runs on the laptop itself.",
        tech: ["Python", "Server-Sent Events", "D-Bus", "PipeWire", "Tailscale"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/remote-phones.webp", width: 880, height: 943, bare: true, name: "laptop and controls" }],
        },
        gallery: [
          { src: "/projects/remote-scrub.webp", width: 1170, height: 2532, name: "scrubbing" },
          { src: "/projects/remote-controls.webp", width: 1170, height: 2532, name: "controls" },
          { src: "/projects/remote-session.webp", width: 1170, height: 2532, name: "sleep timer" },
        ],
        internalTool: true,
        group: "tools",
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
        group: "tools",
        status: "inDevelopment",
      },
      {
        slug: "proposal-kit",
        title: "proposal-kit",
        short: "one colour in, a finished proposal palette out.",
        tagline: "Turns one colour into a full, contrast-checked palette and sets it into a catalog of Typst proposal templates.",
        why:
          "On a sponsorship proposal, my boss asked for “a mix of dark and light shades”, and I spent an afternoon hand-picking browns for three layouts. I'll be writing a lot more proposals like it, so I built what I wished I'd had: give it one colour and get back a whole palette that works on a page, already set in a template.",
        description:
          "A Python CLI with no dependencies. pk palette works out twelve colours in four moods from a single seed, using rules measured from palettes I tuned by hand, and checks every pairing for contrast. pk new copies a template, recolours it and compiles the PDF; pk view renders the whole catalog in any colours and opens it in the browser. Client work stays in a private folder, and the public templates ship with a made-up brand.",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/proposal-kit-templates.webp", width: 2880, height: 1800, name: "templates in generated palettes" },
            { src: "/projects/proposal-kit-gallery.webp", width: 2880, height: 1800, name: "the catalog in the browser" },
          ],
        },
        phone: { src: "/projects/proposal-kit-mobile.webp", width: 1170, height: 2532, name: "phone" },
        gallery: [
          { src: "/projects/proposal-kit-palette.webp", width: 2880, height: 1800, name: "one colour, four moods" },
          { src: "/projects/proposal-kit-brand.webp", width: 2880, height: 1620, name: "the sample brand" },
        ],
        githubHref: "https://github.com/dumbld0re/proposal-kit",
        install: [
          "git clone https://github.com/dumbld0re/proposal-kit.git",
          "ln -s \"$PWD/proposal-kit/pk.py\" ~/.local/bin/pk",
          "pk view teal",
        ],
        tech: ["Python", "Typst", "OKLCH", "Poppler"],
        internalTool: true,
        group: "tools",
        status: "inUse",
      },
      {
        slug: "localsend-drop",
        title: "LocalSend Drop",
        short: "drop files on the bar and they land on the device next to you.",
        description:
          "An Omarchy bar widget for LocalSend. Drag files onto the icon, pick a device, and they go straight over the local network, without opening the LocalSend app. Underneath is a small LocalSend client in plain Python, with no dependencies.",
        tech: ["QML", "Quickshell", "Python", "LocalSend"],
        githubHref: "https://github.com/dumbld0re/omarchy-localsend-drop",
        install: ["omarchy plugin add https://github.com/dumbld0re/omarchy-localsend-drop.git --enable"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/localsend-drop.webp", width: 872, height: 530, bare: true, name: "panel" }],
        },
        group: "tools",
        status: "inUse",
      },
      {
        slug: "speed",
        title: "Speed",
        short: "fast.com speed tests, right in the bar.",
        description:
          "An Omarchy bar widget that shows my last download speed. Click it for upload, idle and loaded latency, a bufferbloat grade and a chart of recent tests. It runs its own fast.com client, written in TypeScript on Bun, and can test on a timer.",
        tech: ["QML", "Quickshell", "TypeScript", "Bun", "SQLite"],
        githubHref: "https://github.com/dumbld0re/omarchy-speed",
        install: ["omarchy pkg add bun", "omarchy plugin add https://github.com/dumbld0re/omarchy-speed.git --enable"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/speed.webp", width: 822, height: 754, bare: true, name: "panel" }],
        },
        group: "tools",
        status: "inUse",
      },
      {
        slug: "ae",
        title: "æ design studio",
        short: "my design studio and its site.",
        tagline: "My design studio and its site.",
        description:
          "Built from scratch. All my web design and client work, case studies included, lives there.",
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
      {
        slug: "gallery-ways",
        title: "Gallery Ways",
        short: "four ways to show a gallery of work.",
        tagline: "Four ways to show a gallery of work: a dock, an orbit, a barcode and a deck.",
        description:
          "Four ways to browse a body of work. Two borrowed from a moodboard video, two of my own. Hover, spin, scroll or throw.",
        tech: ["HTML", "CSS", "JavaScript", "GSAP"],
        demoHref: "/gallery-ways/index.html",
        more: { label: "more work on aestudio.site", href: "https://aestudio.site" },
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/gallery-ways-orbit.webp", width: 2880, height: 1800, name: "orbit" },
            { src: "/projects/gallery-ways-barcode.webp", width: 2880, height: 1800, name: "barcode" },
          ],
        },
        phone: { src: "/projects/gallery-ways-phone.webp", width: 1170, height: 2532, name: "phone" },
        gallery: [
          { src: "/projects/gallery-ways-globe.webp", width: 2880, height: 1800, name: "globe" },
          { src: "/projects/gallery-ways-dock.webp", width: 2880, height: 1800, name: "dock strip" },
          { src: "/projects/gallery-ways-deck.webp", width: 2880, height: 1800, name: "deck and toss" },
        ],
        group: "fun",
        demoOnly: true,
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
    whyLabel: "perché l'ho fatto",
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
        gallery: [{ src: "/projects/fairhour-mobile-people.webp", width: 1170, height: 2532, name: "chi partecipa" }],
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
        slug: "remote",
        title: "Remote",
        short: "il portatile, dal telefono.",
        tagline: "Odiavo dovermi alzare ogni volta che volevo mettere in pausa, così ho fatto un sito tramite Tailscale.",
        description:
          "Un telecomando da telefono per il portatile in HDMI. Tocchi ovunque per la pausa, trascini per scorrere nel video, cambi il volume o l'uscita audio, imposti un timer di spegnimento. Niente App Store, niente account: gira sul portatile stesso.",
        tech: ["Python", "Server-Sent Events", "D-Bus", "PipeWire", "Tailscale"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/remote-phones.webp", width: 880, height: 943, bare: true, name: "portatile e controlli" }],
        },
        gallery: [
          { src: "/projects/remote-scrub.webp", width: 1170, height: 2532, name: "scorrimento" },
          { src: "/projects/remote-controls.webp", width: 1170, height: 2532, name: "controlli" },
          { src: "/projects/remote-session.webp", width: 1170, height: 2532, name: "timer di spegnimento" },
        ],
        internalTool: true,
        group: "tools",
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
        group: "tools",
        status: "inDevelopment",
      },
      {
        slug: "proposal-kit",
        title: "proposal-kit",
        short: "un colore dentro, una palette per proposte già pronta fuori.",
        tagline: "Trasforma un colore in una palette completa e verificata per il contrasto, e la inserisce in un catalogo di modelli Typst per proposte.",
        why:
          "Per una proposta di sponsorizzazione mi è stato chiesto “un mix di toni scuri e chiari”, e ho passato un pomeriggio a scegliere a mano i marroni per tre layout. Scriverò ancora tante proposte così, quindi ho costruito quello che avrei voluto avere: gli dai un colore e ti restituisce un'intera palette che funziona sulla pagina, già inserita in un modello.",
        description:
          "Una CLI in Python senza dipendenze. pk palette ricava da un solo colore dodici tonalità in quattro atmosfere, con regole misurate su palette che ho calibrato a mano, e controlla il contrasto di ogni abbinamento. pk new copia un modello, lo ricolora e compila il PDF; pk view mostra tutto il catalogo nei colori che vuoi e lo apre nel browser. Il lavoro per i clienti resta in una cartella privata, e i modelli pubblici usano un marchio inventato.",
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/proposal-kit-templates.webp", width: 2880, height: 1800, name: "modelli in palette generate" },
            { src: "/projects/proposal-kit-gallery.webp", width: 2880, height: 1800, name: "il catalogo nel browser" },
          ],
        },
        phone: { src: "/projects/proposal-kit-mobile.webp", width: 1170, height: 2532, name: "telefono" },
        gallery: [
          { src: "/projects/proposal-kit-palette.webp", width: 2880, height: 1800, name: "un colore, quattro atmosfere" },
          { src: "/projects/proposal-kit-brand.webp", width: 2880, height: 1620, name: "il marchio di esempio" },
        ],
        githubHref: "https://github.com/dumbld0re/proposal-kit",
        install: [
          "git clone https://github.com/dumbld0re/proposal-kit.git",
          "ln -s \"$PWD/proposal-kit/pk.py\" ~/.local/bin/pk",
          "pk view teal",
        ],
        tech: ["Python", "Typst", "OKLCH", "Poppler"],
        internalTool: true,
        group: "tools",
        status: "inUse",
      },
      {
        slug: "localsend-drop",
        title: "LocalSend Drop",
        short: "trascina i file sulla barra e arrivano al dispositivo accanto.",
        description:
          "Un widget per la barra di Omarchy che usa LocalSend. Trascini i file sull'icona, scegli un dispositivo e partono direttamente sulla rete locale, senza aprire l'app LocalSend. Sotto c'è un piccolo client LocalSend in Python puro, senza dipendenze.",
        tech: ["QML", "Quickshell", "Python", "LocalSend"],
        githubHref: "https://github.com/dumbld0re/omarchy-localsend-drop",
        install: ["omarchy plugin add https://github.com/dumbld0re/omarchy-localsend-drop.git --enable"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/localsend-drop.webp", width: 872, height: 530, bare: true, name: "pannello" }],
        },
        group: "tools",
        status: "inUse",
      },
      {
        slug: "speed",
        title: "Speed",
        short: "speed test di fast.com, direttamente nella barra.",
        description:
          "Un widget per la barra di Omarchy che mostra la mia ultima velocità di download. Un clic apre upload, latenza a riposo e sotto carico, un voto sul bufferbloat e un grafico dei test recenti. Usa un client fast.com tutto suo, scritto in TypeScript su Bun, e può fare test a intervalli.",
        tech: ["QML", "Quickshell", "TypeScript", "Bun", "SQLite"],
        githubHref: "https://github.com/dumbld0re/omarchy-speed",
        install: ["omarchy pkg add bun", "omarchy plugin add https://github.com/dumbld0re/omarchy-speed.git --enable"],
        preview: {
          kind: "screens",
          screens: [{ src: "/projects/speed.webp", width: 822, height: 754, bare: true, name: "pannello" }],
        },
        group: "tools",
        status: "inUse",
      },
      {
        slug: "ae",
        title: "æ design studio",
        short: "il mio studio di design e il suo sito.",
        tagline: "Il mio studio di design e il suo sito.",
        description:
          "Costruito da zero. Tutti i miei lavori di web design e per clienti, casi studio compresi, sono lì.",
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
      {
        slug: "gallery-ways",
        title: "Gallery Ways",
        short: "quattro modi di mostrare una galleria.",
        tagline: "Quattro modi di mostrare una galleria: un dock, un’orbita, un codice a barre e un mazzo.",
        description:
          "Quattro modi di sfogliare un archivio di lavori. Due presi in prestito da un video di moodboard, due miei. Passa sopra, gira, scorri o lancia.",
        tech: ["HTML", "CSS", "JavaScript", "GSAP"],
        demoHref: "/gallery-ways/index.html",
        more: { label: "altri lavori su aestudio.site", href: "https://aestudio.site" },
        preview: {
          kind: "screens",
          screens: [
            { src: "/projects/gallery-ways-orbit.webp", width: 2880, height: 1800, name: "orbita" },
            { src: "/projects/gallery-ways-barcode.webp", width: 2880, height: 1800, name: "codice a barre" },
          ],
        },
        phone: { src: "/projects/gallery-ways-phone.webp", width: 1170, height: 2532, name: "telefono" },
        gallery: [
          { src: "/projects/gallery-ways-globe.webp", width: 2880, height: 1800, name: "globo" },
          { src: "/projects/gallery-ways-dock.webp", width: 2880, height: 1800, name: "striscia dock" },
          { src: "/projects/gallery-ways-deck.webp", width: 2880, height: 1800, name: "mazzo" },
        ],
        group: "fun",
        demoOnly: true,
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

/** Whether the project has its own case study page. */
export const hasCase = (project: Project): project is Project & { slug: string } => !!project.slug && !project.demoOnly
