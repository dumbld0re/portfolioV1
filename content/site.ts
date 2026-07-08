import type { Language } from "@/lib/i18n"

export const siteCopy: Record<
  Language,
  {
    nav: {
      projects: string
      experience: string
      contact: string
      cv: string
    }
    footer: string
    scroll: string
  }
> = {
  de: {
    nav: {
      projects: "Projekte",
      experience: "Erfahrung",
      contact: "Kontakt",
      cv: "Lebenslauf",
    },
    footer: "Alle Rechte vorbehalten.",
    scroll: "Scrollen",
  },
  en: {
    nav: {
      projects: "Projects",
      experience: "Experience",
      contact: "Contact",
      cv: "CV",
    },
    footer: "All rights reserved.",
    scroll: "Scroll",
  },
}
