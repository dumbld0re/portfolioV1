import type { Language } from "@/lib/i18n"

export const contactContent: Record<
  Language,
  {
    title: string
    description: string
    emailLabel: string
    email: string
    cta: string
    phoneLabel: string
    phone: string
    phoneCta: string
    footnote: string
  }
> = {
  en: {
    title: "Contact",
    description:
      "Interested in collaborating or have a project in mind? Reach out and let's discuss how we can build something great together.",
    emailLabel: "Email",
    email: "dannymiiguel@gmail.com",
    cta: "Send Email",
    phoneLabel: "Phone",
    phone: "+264 85 800 0433",
    phoneCta: "Call or WhatsApp",
    footnote: "I usually respond within 24 hours.",
  },
  de: {
    title: "Kontakt",
    description:
      "Interesse an einer Zusammenarbeit oder einem Projekt? Melde dich und wir besprechen, wie wir gemeinsam etwas Großartiges schaffen können.",
    emailLabel: "E-Mail",
    email: "dannymiiguel@gmail.com",
    cta: "E-Mail senden",
    phoneLabel: "Telefon",
    phone: "+264 85 800 0433",
    phoneCta: "Anrufen oder WhatsApp",
    footnote: "Ich antworte in der Regel innerhalb von 24 Stunden.",
  },
}


