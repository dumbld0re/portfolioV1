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
    footer: "2086© (so i dont forget to ever change this)",
    dontClickHere: "nicht klicken",
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
  },
}
