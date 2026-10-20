import type { Language } from "@/lib/i18n"

export type ExperienceItem = {
  role: string
  company: string
  companyHref?: string
  period: string
  description: string
}

export const experienceContent: Record<
  Language,
  {
    title: string
    experiences: ExperienceItem[]
    skills: {
      title: string
      items: string[]
    }
  }
> = {
  de: {
    title: "Erfahrung",
    experiences: [
      {
        role: "Deutsch-Nachhilfelehrer",
        company: "Fluent Academy",
        companyHref: "https://fluentacademy.co/",
        period: "Seit Dez. 2025",
        description: "Deutschunterricht für Lernende.",
      },
      {
        role: "Frontend-Entwickler",
        company: "Selbstständig",
        period: "Seit 2024",
        description: "Ich baue Websites für Leute.",
      },
      {
        role: "Robotik-Praktikant",
        company: "MindsInAction",
        companyHref: "https://mindsinaction.com.na/",
        period: "2025",
        description: "Python-Tools und Arduino-Logik für Robotikprojekte.",
      },
      {
        role: "Praktikant Buchhaltung & Verwaltung",
        company: "Pyronam",
        period: "2024",
        description: "Rechnungen, Tabellen und tägliche Verwaltungsabläufe.",
      },
    ],
    skills: {
      title: "Fähigkeiten",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Python", "Git", "Linux", "Docker", "Vercel", "Figma", "Typst"],
    },
  },
  en: {
    title: "Experience",
    experiences: [
      {
        role: "German Tutor",
        company: "Fluent Academy",
        companyHref: "https://fluentacademy.co/",
        period: "Dec 2025 - Present",
        description: "Teaching German to learners.",
      },
      {
        role: "Frontend Developer",
        company: "Self-Employed",
        period: "2024 - Present",
        description: "I build websites for people.",
      },
      {
        role: "Robotics Intern",
        company: "MindsInAction",
        companyHref: "https://mindsinaction.com.na/",
        period: "2025",
        description: "Built Python tooling and Arduino logic for robotics projects.",
      },
      {
        role: "Accounting & Administrative Intern",
        company: "Pyronam",
        period: "2024",
        description: "Handled invoicing, spreadsheets, and daily office workflows.",
      },
    ],
    skills: {
      title: "Skills",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Python", "Git", "Linux", "Docker", "Vercel", "Figma", "Typst"],
    },
  },
}
