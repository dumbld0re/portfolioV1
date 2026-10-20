import type { Language } from "@/lib/i18n"

export const homeContent: Record<
  Language,
  {
    hero: {
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
      name: "danny-miguel mittelberger",
      subtitle: "Entwickler • Linux-Enthusiast",
      intro:
        "Ich baue schnelle, saubere Web-Interfaces für kleine Unternehmen und Privatpersonen – daneben studiere ich Quantitative Finance an der University of Namibia (UNAM).",
      description:
        "Nebenbei arbeite ich als Freelancer – mit einer Schwäche für Linux und alles, was im Terminal läuft.",
      location: "Windhoek, Namibia",
      status: "status: offen für projekte",
      introLabel: "Über mich",
      cta: "Lass uns zusammenarbeiten",
    },
  },
  en: {
    hero: {
      name: "danny-miguel mittelberger",
      subtitle: "Developer • Linux Enthusiast",
      intro:
        "I build fast, clean web interfaces for small businesses and individuals – alongside studying quantitative finance at the University of Namibia (UNAM).",
      description:
        "I freelance here and there – with a soft spot for Linux and everything that runs in a terminal.",
      location: "Windhoek, Namibia",
      status: "status: open to work",
      introLabel: "Introduction",
      cta: "Let's work together",
    },
  },
}
