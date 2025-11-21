import type { Language } from "@/lib/i18n"

export const siteCopy: Record<
  Language,
  {
    nav: {
      projects: string
      experience: string
    }
    footer: string
  }
> = {
  de: {
    nav: {
      projects: "Projekte",
      experience: "Erfahrung",
    },
    footer: "Alle Rechte vorbehalten.",
  },
  en: {
    nav: {
      projects: "Projects",
      experience: "Experience",
    },
    footer: "All rights reserved.",
  },
}

