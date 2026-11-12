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

/**
 * The section's text: paragraphs with roles dropped in by company name. Each
 * one shows as a highlighted name (or `text`, where there's no employer to
 * name) with its dates beside it, both taken from `experiences`.
 */
export type ExperienceProse = (string | { company: string; text?: string })[][]

export const experienceContent: Record<
  Language,
  {
    title: string
    /** Flow C prototype: the word of `title` set on a pill. */
    titlePill?: string
    present: string
    prose: ExperienceProse
    experiences: ExperienceItem[]
  }
> = {
  de: {
    title: "wo ich gearbeitet habe",
    titlePill: "gearbeitet",
    present: "heute",
    prose: [
      [
        "gerade mache ich drei Dinge gleichzeitig. ich bin im Executive Team von ",
        { company: "Oratores Novi" },
        " und baue dort die digitalen Abläufe auf: Ablage, Anmeldungen und die Datenbanken dahinter. ich führe ",
        { company: "aestudio" },
        ", mein Studio für Webdesign und Websites. und ich unterrichte Deutsch bei ",
        { company: "Fluent Academy" },
        ".",
      ],
      [
        "davor war ich freiberuflicher ",
        { company: "Selbstständig", text: "Frontend-Entwickler" },
        ", daraus ist aestudio entstanden. ich habe Python-Tools und Arduino-Logik für Roboter bei ",
        { company: "MindsInAction" },
        " gebaut und bei ",
        { company: "Pyronam" },
        " Rechnungen und Tabellen in Ordnung gehalten.",
      ],
    ],
    experiences: [
      {
        role: "Koordinator Digitale Verwaltung",
        company: "Oratores Novi",
        companyHref: "https://oratoresnovi.org/",
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
    titlePill: "worked",
    present: "now",
    prose: [
      [
        "right now i do three things at once. i sit on the executive team of ",
        { company: "Oratores Novi" },
        ", where i set up the digital side: filing, event sign-ups and the databases behind them. i run ",
        { company: "aestudio" },
        ", my studio for designing and building websites. and i teach German at ",
        { company: "Fluent Academy" },
        ".",
      ],
      [
        "before that i freelanced as a ",
        { company: "Self-employed", text: "frontend developer" },
        ", which grew into aestudio. i built Python tooling and Arduino logic for robots at ",
        { company: "MindsInAction" },
        ", and kept the invoices and spreadsheets in order at ",
        { company: "Pyronam" },
        ".",
      ],
    ],
    experiences: [
      {
        role: "Digital Administration Coordinator",
        company: "Oratores Novi",
        companyHref: "https://oratoresnovi.org/",
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
  it: {
    title: "dove ho lavorato",
    titlePill: "lavorato",
    present: "oggi",
    prose: [
      [
        "al momento faccio tre cose insieme. faccio parte del comitato esecutivo di ",
        { company: "Oratores Novi" },
        ", dove mi occupo della parte digitale: archivio, iscrizioni agli eventi e i database che ci stanno dietro. dirigo ",
        { company: "aestudio" },
        ", il mio studio di design e sviluppo di siti web. e insegno tedesco alla ",
        { company: "Fluent Academy" },
        ".",
      ],
      [
        "prima lavoravo da freelance come ",
        { company: "Freelance", text: "sviluppatore frontend" },
        ", ed è da lì che è nato aestudio. ho creato strumenti in Python e logica Arduino per robot da ",
        { company: "MindsInAction" },
        " e ho tenuto in ordine fatture e fogli di calcolo da ",
        { company: "Pyronam" },
        ".",
      ],
    ],
    experiences: [
      {
        role: "Coordinatore dell'amministrazione digitale",
        company: "Oratores Novi",
        companyHref: "https://oratoresnovi.org/",
        start: "2026-10",
        description:
          "Nel comitato esecutivo. Mi occupo della parte digitale: archivio, iscrizioni e attestati per gli eventi, e i database che ci stanno dietro.",
      },
      {
        role: "Tutor di tedesco",
        company: "Fluent Academy",
        companyHref: "https://fluentacademy.co/",
        start: "2025-12",
        description: "Insegno tedesco a chi lo sta imparando.",
      },
      {
        role: "Fondatore",
        company: "aestudio",
        companyHref: "https://www.aestudio.site/",
        start: "2026-07",
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
