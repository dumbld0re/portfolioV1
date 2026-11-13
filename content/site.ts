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
    sound: string
    soundLabel: string
    themeLabel: string
    notFound: string
    home: string
    backToTop: string
    sayHello: string
    on: string
    off: string
    loopLabel: string
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
    sound: "ton",
    soundLabel: "Ton ein- oder ausschalten",
    themeLabel: "Farbschema wechseln",
    notFound: "nicht gefunden",
    home: "zurück zur startseite",
    backToTop: "nach oben",
    sayHello: "sag hallo",
    on: "an",
    off: "aus",
    loopLabel: "Endloses Scrollen ein- oder ausschalten",
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
    sound: "sound",
    soundLabel: "Turn sound on or off",
    themeLabel: "Toggle theme",
    notFound: "not found",
    home: "back to the start",
    backToTop: "back to top",
    sayHello: "say hello",
    on: "on",
    off: "off",
    loopLabel: "Turn endless scrolling on or off",
  },
  it: {
    nav: {
      projects: "Progetti",
      experience: "Esperienza",
      contact: "Contatti",
      cv: "CV",
      posts: "Articoli",
    },
    cvDownload: "scarica il pdf",
    cvOpen: "apri nel browser",
    footer: "2086© (così non devo cambiarlo mai più)",
    lastUpdated: "ultimo aggiornamento",
    visitors: "visitatori",
    dontClickHere: "non cliccare qui",
    boring: "Noioso",
    boringLabel: "Attiva o disattiva la modalità noiosa",
    sound: "suono",
    soundLabel: "Attiva o disattiva il suono",
    themeLabel: "Cambia tema",
    notFound: "non trovata",
    home: "torna all'inizio",
    backToTop: "torna su",
    sayHello: "dimmi ciao",
    on: "sì",
    off: "no",
    loopLabel: "Attiva o disattiva lo scorrimento infinito",
  },
}
