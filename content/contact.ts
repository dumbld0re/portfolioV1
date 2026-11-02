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
    writeLabel: string
    elsewhereLabel: string
    localTimeLabel: string
  }
> = {
  de: {
    title: "Kontakt",
    heading: "sag hallo.",
    blurbBefore: "Egal ob du eine Idee hast, eine Frage, oder einfach reden willst, schreib mir an",
    email: "dannymiiguel@gmail.com",
    blurbAfter: ". Gern auch ganz formlos.",
    phone: "+264 81 821 0003",
    backToTop: "nach oben",
    writeLabel: "Schreib mir",
    elsewhereLabel: "Im Netz",
    localTimeLabel: "Deine Ortszeit",
  },
  en: {
    title: "Contact",
    heading: "say hi.",
    blurbBefore: "Whether you have an idea, a question, or just want to talk, write to me at",
    email: "dannymiiguel@gmail.com",
    blurbAfter: ". No need to be formal.",
    phone: "+264 81 821 0003",
    backToTop: "back to top",
    writeLabel: "Write",
    elsewhereLabel: "Elsewhere",
    localTimeLabel: "Your local time",
  },
}
