"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Github, Linkedin, Mail } from "lucide-react"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()
  const { language, toggleLanguage } = useLanguage()
  const labels = siteCopy[language]

  const getFilePath = () => {
    if (pathname === "/") return "/home/danny/"
    if (pathname === "/projects") return "/home/danny/projects"
    if (pathname === "/experience") return "/home/danny/experience"
    return "/home/danny/"
  }

  return (
    <header className="w-full px-6 py-6 md:px-12 lg:px-16">
      <nav className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="font-mono text-sm md:text-base text-foreground/80 hover:text-foreground transition-colors flex items-center gap-3"
          aria-label="Navigate home"
        >
          <span className="font-bold text-base md:text-lg">DM</span>
          <span className="text-muted-foreground/50" aria-hidden="true">
            |
          </span>
          <span>{getFilePath()}</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-current={pathname === "/projects" ? "page" : undefined}
            >
              {labels.nav.projects}
            </Link>
            <Link
              href="/experience"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-current={pathname === "/experience" ? "page" : undefined}
            >
              {labels.nav.experience}
            </Link>
            <span className="text-muted-foreground/50" aria-hidden="true">
              |
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-sm text-muted-foreground hover:text-foreground font-mono p-0 h-auto"
              aria-pressed={language === "en"}
              aria-label={`Switch to ${language === "de" ? "English" : "German"}`}
            >
              {language === "de" ? "EN" : "DE"}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" asChild>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="size-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="size-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" asChild>
              <a href="mailto:dannymiiguel@gmail.com">
                <Mail className="size-4" />
                <span className="sr-only">E-Mail</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" asChild>
              <a href="#cv">
                <FileText className="size-4" />
                <span className="sr-only">CV</span>
              </a>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
