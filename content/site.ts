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
    scroll: string
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
    footer: "2086© danny-miguel (so i dont forget to ever change this)",
    scroll: "Scrollen",
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
    footer: "2086© danny-miguel (so i dont forget to ever change this)",
    scroll: "Scroll",
    dontClickHere: "dont click here",
  },
}
