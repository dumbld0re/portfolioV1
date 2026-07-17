import type { Language } from "@/lib/i18n"

export const contactContent: Record<
  Language,
  {
    title: string
    statement: string
    email: string
    getInTouch: string
    phone: string
    phoneCta: string
    responseTime: string
    role: string
    location: string
    backToTop: string
  }
> = {
  de: {
    title: "Kontakt",
    statement: "lass uns etwas bauen.",
    email: "dannymiiguel@gmail.com",
    getInTouch: "Kontakt aufnehmen",
    phone: "+264 85 800 0433",
    phoneCta: "Anrufen / WhatsApp",
    responseTime: "antwortet meist innerhalb von 24 h.",
    role: "entwickler & designer",
    location: "windhoek, namibia",
    backToTop: "nach oben",
  },
  en: {
    title: "Contact",
    statement: "let's build something.",
    email: "dannymiiguel@gmail.com",
    getInTouch: "Get in touch",
    phone: "+264 85 800 0433",
    phoneCta: "Call / WhatsApp",
    responseTime: "usually replies within 24h.",
    role: "developer & designer",
    location: "windhoek, namibia",
    backToTop: "back to top",
  },
}
