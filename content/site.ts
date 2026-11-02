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
    footer: string
    dontClickHere: string
    boring: string
    boringLabel: string
    themeLabel: string
    notFound: string
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
    footer: "2086© (damit ich das nie wieder ändern muss)",
    dontClickHere: "bloß nicht klicken",
    boring: "Langweilig",
    boringLabel: "Langweiligen Modus umschalten",
    themeLabel: "Farbschema wechseln",
    notFound: "nicht gefunden",
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
    footer: "2086© (so i dont forget to ever change this)",
    dontClickHere: "dont click here",
    boring: "Boring",
    boringLabel: "Toggle boring mode",
    themeLabel: "Toggle theme",
    notFound: "not found",
    sayHello: "say hello",
    on: "on",
    off: "off",
    pauseAnimation: "pause animation",
    playAnimation: "play animation",
  },
}
