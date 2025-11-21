import type { Language } from "@/lib/i18n"

export type Project = {
  title: string
  description: string
  tech: string[]
}

export const projectsContent: Record<
  Language,
  {
    title: string
    description: string
    projects: Project[]
  }
> = {
  de: {
    title: "Projekte",
    description: "Eine Auswahl meiner bisherigen Arbeiten und Projekte.",
    projects: [
      {
        title: "E-Commerce Platform",
        description: "Eine moderne E-Commerce-Lösung mit React und Next.js",
        tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        title: "Dashboard Analytics",
        description: "Interaktives Dashboard für Datenvisualisierung",
        tech: ["React", "D3.js", "Node.js", "PostgreSQL"],
      },
      {
        title: "Portfolio Website",
        description: "Minimalistische Portfolio-Website für Kreative",
        tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
      },
    ],
  },
  en: {
    title: "Projects",
    description: "A selection of my previous work and projects.",
    projects: [
      {
        title: "E-Commerce Platform",
        description: "A modern e-commerce solution built with React and Next.js",
        tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        title: "Dashboard Analytics",
        description: "Interactive dashboard for data visualization",
        tech: ["React", "D3.js", "Node.js", "PostgreSQL"],
      },
      {
        title: "Portfolio Website",
        description: "Minimalist portfolio website for creatives",
        tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
      },
    ],
  },
}

