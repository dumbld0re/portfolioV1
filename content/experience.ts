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
  /** A few words on what I do there, for the list under "me". Roles with one are listed. */
  brief?: string
}

export const experienceContent: Record<
  Language,
  {
    present: string
    /** The line above the list of what I do now. */
    now: string
    /** What else I've done, in one line under it. */
    also: string
    experiences: ExperienceItem[]
  }
> = {
  de: {
    present: "heute",
    now: "gerade mache ich drei dinge gleichzeitig:",
    also: "außerdem habe ich erfahrung mit rechnungen, buchhaltung und verwaltung, mit robotik (python und arduino) und als freiberuflicher frontend-entwickler.",
    experiences: [
      {
        role: "Koordinator Digitale Verwaltung",
        company: "Oratores Novi",
        companyHref: "https://oratoresnovi.org/",
        start: "2026-10",
        brief: "digitale verwaltung im executive team",
        description:
          "Teil des Executive Teams. Ich baue die digitalen Abläufe auf: Ablage, Anmeldungen und Zertifikate für Veranstaltungen, Datenbanken.",
      },
      {
        role: "Deutsch-Nachhilfelehrer",
        company: "Fluent Academy",
        companyHref: "https://fluentacademy.co/",
        start: "2025-12",
        brief: "deutschunterricht",
        description: "Deutschunterricht für Lernende.",
      },
      {
        role: "Gründer",
        company: "aestudio",
        companyHref: "https://www.aestudio.site/",
        start: "2026-07",
        brief: "mein studio für webdesign",
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
    present: "now",
    now: "right now i do three things at once:",
    also: "i also have experience with invoicing, accounting and admin work, robotics (python and arduino) and freelance frontend development.",
    experiences: [
      {
        role: "Digital Administration Coordinator",
        company: "Oratores Novi",
        companyHref: "https://oratoresnovi.org/",
        start: "2026-10",
        brief: "digital admin on the executive team",
        description:
          "On the executive team. I set up the digital side of things: filing, event sign-ups and certificates, and the databases behind them.",
      },
      {
        role: "German Tutor",
        company: "Fluent Academy",
        companyHref: "https://fluentacademy.co/",
        start: "2025-12",
        brief: "teaching german",
        description: "Teaching German to learners.",
      },
      {
        role: "Founder",
        company: "aestudio",
        companyHref: "https://www.aestudio.site/",
        start: "2026-07",
        brief: "my web design studio",
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
  it: {
    present: "oggi",
    now: "al momento faccio tre cose insieme:",
    also: "ho anche esperienza con fatturazione, contabilità e amministrazione, robotica (python e arduino) e sviluppo frontend da freelance.",
    experiences: [
      {
        role: "Coordinatore dell'amministrazione digitale",
        company: "Oratores Novi",
        companyHref: "https://oratoresnovi.org/",
        start: "2026-10",
        brief: "amministrazione digitale nel comitato esecutivo",
        description:
          "Nel comitato esecutivo. Mi occupo della parte digitale: archivio, iscrizioni e attestati per gli eventi, e i database che ci stanno dietro.",
      },
      {
        role: "Tutor di tedesco",
        company: "Fluent Academy",
        companyHref: "https://fluentacademy.co/",
        start: "2025-12",
        brief: "insegno tedesco",
        description: "Insegno tedesco a chi lo sta imparando.",
      },
      {
        role: "Fondatore",
        company: "aestudio",
        companyHref: "https://www.aestudio.site/",
        start: "2026-07",
        brief: "il mio studio di web design",
        description: "Progetto e sviluppo siti web. Tutti questi lavori, casi studio compresi, sono su aestudio.",
      },
      {
        role: "Sviluppatore frontend freelance",
        company: "Freelance",
        start: "2025",
        end: "2026-06",
        description: "Siti web veloci e responsive per piccole imprese e privati, con React e Next.js. Da qui è nato aestudio.",
      },
      {
        role: "Stagista di robotica",
        company: "MindsInAction",
        companyHref: "https://mindsinaction.com.na/",
        start: "2025-05",
        end: "2025-08",
        description: "Strumenti in Python e logica Arduino per progetti di robotica.",
      },
      {
        role: "Stagista in contabilità e amministrazione",
        company: "Pyronam",
        start: "2024-06",
        end: "2024-12",
        description: "Fatture, fogli di calcolo e attività quotidiane d'ufficio.",
      },
    ],
  },
}
