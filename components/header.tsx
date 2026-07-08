"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FileText, Github, Mail } from "lucide-react"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const { language, toggleLanguage } = useLanguage()
  const labels = siteCopy[language]
  const [boot] = useState(() => !hasBootPlayed())

  useEffect(() => {
    markBootPlayed()
  }, [])

  const [boring, setBoring] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("boring") === "1"
    setBoring(stored)
    document.documentElement.classList.toggle("boring", stored)
  }, [])

  const toggleBoring = () => {
    setBoring((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("boring", next)
      localStorage.setItem("boring", next ? "1" : "0")
      return next
    })
  }

  const getFilePath = () => {
    if (pathname === "/cv") return "/home/danny-miguel/cv"
    if (pathname === "/posts") return "/home/danny-miguel/posts"
    return "/home/danny-miguel/"
  }

  return (
    <header className="sticky top-0 z-30 w-full px-6 py-6 md:px-12 lg:px-16 bg-background/80 backdrop-blur-sm border-b border-border/40 print:hidden">
      <nav
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto",
          boot && "motion-safe:animate-reveal-up",
        )}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-sm md:text-base text-foreground/80 hover:text-foreground transition-colors flex items-center gap-3 flex-1 min-w-0"
              aria-label="Navigate home"
            >
              <span className="font-bold text-base md:text-lg whitespace-nowrap">DM</span>
              <span className="text-muted-foreground/50" aria-hidden="true">
                |
              </span>
              <span className="truncate">{getFilePath()}</span>
            </Link>

            <div className="flex items-center gap-2 md:hidden ml-auto">
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" asChild>
                <a href="https://github.com/dumbld0re" target="_blank" rel="noreferrer">
                  <Github className="size-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" asChild>
                <a href="mailto:dannymiiguel@gmail.com">
                  <Mail className="size-4" />
                  <span className="sr-only">E-Mail</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" asChild>
                <Link href="/cv">
                  <FileText className="size-4" />
                  <span className="sr-only">{labels.nav.cv}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex items-center gap-6">
            <Link href="/#projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {labels.nav.projects}
            </Link>
            <Link href="/#experience" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {labels.nav.experience}
            </Link>
            <Link href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {labels.nav.contact}
            </Link>
            <Link
              href="/cv"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-current={pathname === "/cv" ? "page" : undefined}
            >
              {labels.nav.cv}
            </Link>
            <Link
              href="/posts"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-current={pathname === "/posts" ? "page" : undefined}
            >
              {labels.nav.posts}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBoring}
              className="text-sm text-muted-foreground hover:text-foreground font-mono p-0 h-auto"
              aria-pressed={boring}
              aria-label="Toggle boring mode"
            >
              Boring
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" asChild>
              <a href="https://github.com/dumbld0re" target="_blank" rel="noreferrer">
                <Github className="size-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" asChild>
              <a href="mailto:dannymiiguel@gmail.com">
                <Mail className="size-4" />
                <span className="sr-only">E-Mail</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/cv">
                <FileText className="size-4" />
                <span className="sr-only">{labels.nav.cv}</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
