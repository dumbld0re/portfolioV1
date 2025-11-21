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
    }
  }
> = {
  de: {
    hero: {
      name: "danny-miguel mittelberger",
      subtitle: "Frontend-Entwickler • Linux-Enthusiast",
      intro: "Hallo, ich bin Danny-Miguel Mittelberger – ein leidenschaftlicher Frontend-Entwickler aus Windhoek, Namibia.",
      description:
        "Als Freelancer konzentriere ich mich auf moderne Web-Technologien und bin derzeit für neue Projekte verfügbar. Mit meiner Expertise in Frontend-Entwicklung und meiner Begeisterung für Linux helfe ich Unternehmen dabei, beeindruckende digitale Erlebnisse zu schaffen.",
      location: "Windhoek, Namibia",
      status: "Freelancer – Verfügbar für Arbeit",
    },
  },
  en: {
    hero: {
      name: "danny-miguel mittelberger",
      subtitle: "Frontend Developer • Linux Enthusiast",
      intro: "Hello, I'm Danny-Miguel Mittelberger – a passionate Frontend Developer based in Windhoek, Namibia.",
      description:
        "As a freelancer, I focus on modern web technologies and am currently available for new projects. With my expertise in frontend development and passion for Linux, I help companies create impressive digital experiences.",
      location: "Windhoek, Namibia",
      status: "Freelancer – Available for Work",
    },
  },
}

