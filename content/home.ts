import type { Language } from "@/lib/i18n"

export const homeContent: Record<
  Language,
  {
    hero: {
      role: string
      name: string
      subtitle: string
      intro: string
      description: string
      location: string
      status: string
      introLabel: string
      cta: string
    }
  }
> = {
  de: {
    hero: {
      role: "Quantitativer Finance Student — UNAM",
      name: "danny-miguel mittelberger",
      subtitle: "Entwickler • Linux-Enthusiast",
      intro:
        "Hallo, ich bin Danny-Miguel Mittelberger – quantitativer finance Student an der University of Namibia (UNAM) und ein Entwickler.",
      description:
        "Als Freelancer bin ich derzeit für neue Projekte verfügbar – mit einer Schwäche für Linux und alles, was im Terminal läuft.",
      location: "Windhoek, Namibia",
      status: "Freelancer – Verfügbar für Arbeit",
      introLabel: "Einführung",
      cta: "Lass uns zusammenarbeiten",
    },
  },
  en: {
    hero: {
      role: "Quantitative Finance Student — UNAM",
      name: "danny-miguel mittelberger",
      subtitle: "Developer • Linux Enthusiast",
      intro:
        "Hello, I'm Danny-Miguel Mittelberger – a quantitative finance student at the University of Namibia (UNAM) and a developer.",
      description:
        "I freelance here and there – with a soft spot for Linux and everything that runs in a terminal.",
      location: "Windhoek, Namibia",
      status: "Freelancer – Available for Work",
      introLabel: "Introduction",
      cta: "Let's work together",
    },
  },
}
