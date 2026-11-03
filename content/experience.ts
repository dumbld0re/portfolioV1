import type { Language } from "@/lib/i18n"

export type ExperienceItem = {
  role: string
  company: string
  companyHref?: string
  /** "2026-10" (month) or "2024" (year only). */
  start: string
  /** Same format as start. Leave out while the role is ongoing. */
  end?: string
  description?: string
}

/** Roles without an end are listed under "now", the rest under "before"; the section sorts them. */
export const experienceContent: Record<
  Language,
  {
    title: string
    current: string
    past: string
    present: string
    experiences: ExperienceItem[]
  }
> = {
  de: {
    title: "wo ich gearbeitet habe",
    current: "aktuell",
    past: "davor",
    present: "heute",
    experiences: [
      {
        role: "Koordinator Digitale Verwaltung",
        company: "Oratores Novi",
        start: "2026-10",
        description:
          "Teil des Executive Teams. Ich baue die digitalen Abläufe auf: Ablage, Anmeldungen und Zertifikate für Veranstaltungen, Datenbanken.",
      },
      {
        role: "Deutsch-Nachhilfelehrer",
        company: "Fluent Academy",
        companyHref: "https://fluentacademy.co/",
        start: "2025-12",
        description: "Deutschunterricht für Lernende.",
      },
      {
        role: "Gründer",
        company: "aestudio",
        companyHref: "https://www.aestudio.site/",
        start: "2026-07",
        description: "Ich gestalte und baue Websites. Alle Arbeiten und Case Studies dazu findest du auf aestudio.",
      },
      {
        role: "Freiberuflicher Frontend-Entwickler",
        company: "Selbstständig",
        start: "2025",
        end: "2026-06",
        description: "Schnelle, responsive Websites für kleine Unternehmen und Privatpersonen, mit React und Next.js. Daraus ist aestudio entstanden.",
      },
      {
        role: "Robotik-Praktikant",
        company: "MindsInAction",
        companyHref: "https://mindsinaction.com.na/",
        start: "2025-05",
        end: "2025-08",
        description: "Python-Tools und Arduino-Logik für Robotikprojekte.",
      },
      {
        role: "Praktikant Buchhaltung & Verwaltung",
        company: "Pyronam",
        start: "2024-06",
        end: "2024-12",
        description: "Rechnungen, Tabellen und tägliche Verwaltungsabläufe.",
      },
    ],
  },
  en: {
    title: "where i have worked",
    current: "now",
    past: "before",
    present: "now",
    experiences: [
      {
        role: "Digital Administration Coordinator",
        company: "Oratores Novi",
        start: "2026-10",
        description:
          "On the executive team. I set up the digital side of things: filing, event sign-ups and certificates, and the databases behind them.",
      },
      {
        role: "German Tutor",
        company: "Fluent Academy",
        companyHref: "https://fluentacademy.co/",
        start: "2025-12",
        description: "Teaching German to learners.",
      },
      {
        role: "Founder",
        company: "aestudio",
        companyHref: "https://www.aestudio.site/",
        start: "2026-07",
        description: "I design and build websites. All of that work, case studies included, lives on aestudio.",
      },
      {
        role: "Freelance Frontend Developer",
        company: "Self-employed",
        start: "2025",
        end: "2026-06",
        description: "Built fast, responsive websites for small businesses and individuals with React and Next.js. This grew into aestudio.",
      },
      {
        role: "Robotics Intern",
        company: "MindsInAction",
        companyHref: "https://mindsinaction.com.na/",
        start: "2025-05",
        end: "2025-08",
        description: "Built Python tooling and Arduino logic for robotics projects.",
      },
      {
        role: "Accounting & Administrative Intern",
        company: "Pyronam",
        start: "2024-06",
        end: "2024-12",
        description: "Handled invoicing, spreadsheets, and daily office workflows.",
      },
    ],
  },
}
