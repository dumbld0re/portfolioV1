import type { Language } from "@/lib/i18n"

export const contactContent: Record<
  Language,
  {
    title: string
    heading: string
    blurbBefore: string
    email: string
    blurbAfter: string
    phone: string
    backToTop: string
  }
> = {
  de: {
    title: "Kontakt",
    heading: "lass uns etwas bauen.",
    blurbBefore: "hast du ein projekt im kopf oder möchtest einfach quatschen? schreib mir an",
    email: "dannymiiguel@gmail.com",
    blurbAfter: "— ich freue mich, von dir zu hören.",
    phone: "+264 85 800 0433",
    backToTop: "nach oben",
  },
  en: {
    title: "Contact",
    heading: "let's build something.",
    blurbBefore: "got a project in mind, or just want to chat? drop me a line at",
    email: "dannymiiguel@gmail.com",
    blurbAfter: "— i'd love to hear from you.",
    phone: "+264 85 800 0433",
    backToTop: "back to top",
  },
}
