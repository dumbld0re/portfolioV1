import type { Language } from "@/lib/i18n"

export const siteCopy: Record<
  Language,
  {
    nav: {
      projects: string
      experience: string
      contact: string
      cv: string
      posts: string
    }
    cvDownload: string
    cvOpen: string
    footer: string
    lastUpdated: string
    visitors: string
    dontClickHere: string
    boring: string
    boringLabel: string
    themeLabel: string
    notFound: string
    home: string
    backToTop: string
    sayHello: string
    on: string
    off: string
    pauseAnimation: string
    playAnimation: string
  }
> = {
  de: {
    nav: {
      projects: "Projekte",
      experience: "Erfahrung",
      contact: "Kontakt",
      cv: "Lebenslauf",
      posts: "Beiträge",
    },
    cvDownload: "pdf herunterladen",
    cvOpen: "im browser ansehen",
    footer: "2086© (damit ich das nie wieder ändern muss)",
    lastUpdated: "zuletzt aktualisiert",
    visitors: "besucher",
    dontClickHere: "bloß nicht klicken",
    boring: "Langweilig",
    boringLabel: "Langweiligen Modus umschalten",
    themeLabel: "Farbschema wechseln",
    notFound: "nicht gefunden",
    home: "zurück zur startseite",
    backToTop: "nach oben",
    sayHello: "sag hallo",
    on: "an",
    off: "aus",
    pauseAnimation: "animation anhalten",
    playAnimation: "animation abspielen",
  },
  en: {
    nav: {
      projects: "Projects",
      experience: "Experience",
      contact: "Contact",
      cv: "CV",
      posts: "Posts",
    },
    cvDownload: "download pdf",
    cvOpen: "view in browser",
    footer: "2086© (so i dont forget to ever change this)",
    lastUpdated: "last updated",
    visitors: "visitors",
    dontClickHere: "dont click here",
    boring: "Boring",
    boringLabel: "Toggle boring mode",
    themeLabel: "Toggle theme",
    notFound: "not found",
    home: "back to the start",
    backToTop: "back to top",
    sayHello: "say hello",
    on: "on",
    off: "off",
    pauseAnimation: "pause animation",
    playAnimation: "play animation",
  },
}
