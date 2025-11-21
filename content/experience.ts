import type { Language } from "@/lib/i18n"

export type ExperienceItem = {
  role: string
  company: string
  period: string
  description: string
}

export type SkillCategory = {
  name: string
  items: string[]
}

export const experienceContent: Record<
  Language,
  {
    title: string
    description: string
    experiences: ExperienceItem[]
    skills: {
      title: string
      categories: SkillCategory[]
    }
  }
> = {
  de: {
    title: "Erfahrung",
    description: "Mein beruflicher Werdegang und meine Fähigkeiten.",
    experiences: [
      {
        role: "Frontend-Entwickler",
        company: "Selbstständig",
        period: "Seit 2024",
        description:
          "Entwerfe und entwickle responsive Weboberflächen mit React, Next.js und modernen Toolchains für eigene und Kundenprojekte.",
      },
      {
        role: "Robotik-Praktikant",
        company: "MindsInAction",
        period: "2025",
        description:
          "Debuggte interne Apps, entwickelte Python-Skripte und schrieb Arduino-Logik zur Unterstützung der MindsInAction-Robotikprojekte.",
      },
      {
        role: "Praktikant Buchhaltung & Verwaltung",
        company: "Pyronam",
        period: "2024",
        description: "Koordinierte Rechnungen, pflegte Tabellen und optimierte tägliche Verwaltungsabläufe.",
      },
    ],
    skills: {
      title: "Fähigkeiten",
      categories: [
        {
          name: "Frontend",
          items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
        },
        {
          name: "Tools & Andere",
          items: ["Git", "Linux", "Docker", "Vercel", "Figma"],
        },
      ],
    },
  },
  en: {
    title: "Experience",
    description: "My professional background and skills.",
    experiences: [
      {
        role: "Frontend Developer",
        company: "Self-Employed",
        period: "2024 - Present",
        description:
          "Designing and shipping responsive web interfaces with React, Next.js, and modern toolchains for personal and client work.",
      },
      {
        role: "Robotics Intern",
        company: "MindsInAction",
        period: "2025",
        description:
          "Debugged internal apps, built Python tooling, and authored Arduino logic to support MindsInAction robotics projects.",
      },
      {
        role: "Accounting & Administrative Intern",
        company: "Pyronam",
        period: "2024",
        description: "Coordinated invoicing, maintained spreadsheets, and streamlined day-to-day office workflows.",
      },
    ],
    skills: {
      title: "Skills",
      categories: [
        {
          name: "Frontend",
          items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
        },
        {
          name: "Tools & Others",
          items: ["Git", "Linux", "Docker", "Vercel", "Figma"],
        },
      ],
    },
  },
}

