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
        role: "Freelance Frontend Developer",
        company: "Selbstständig",
        period: "2022 - Heute",
        description:
          "Entwicklung moderner Web-Anwendungen für verschiedene Kunden. Fokus auf React, Next.js und responsive Design.",
      },
      {
        role: "Web Developer",
        company: "Tech Startup",
        period: "2020 - 2022",
        description:
          "Aufbau von User Interfaces und Integration von APIs. Zusammenarbeit in agilen Teams und Code-Reviews.",
      },
      {
        role: "Junior Developer",
        company: "Digital Agentur",
        period: "2018 - 2020",
        description:
          "Unterstützung bei der Entwicklung von Websites und Web-Applikationen. Erlernung moderner Frontend-Technologien.",
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
        role: "Freelance Frontend Developer",
        company: "Self-Employed",
        period: "2022 - Present",
        description:
          "Developing modern web applications for various clients. Focus on React, Next.js and responsive design.",
      },
      {
        role: "Web Developer",
        company: "Tech Startup",
        period: "2020 - 2022",
        description:
          "Building user interfaces and integrating APIs. Collaborating in agile teams and conducting code reviews.",
      },
      {
        role: "Junior Developer",
        company: "Digital Agency",
        period: "2018 - 2020",
        description:
          "Supporting the development of websites and web applications. Learning modern frontend technologies.",
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

