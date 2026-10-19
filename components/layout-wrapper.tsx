"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { AsciiBackground } from "@/components/ascii-background"
import { BoringToggle } from "@/components/boring-toggle"
import { DontClickLink } from "@/components/dont-click-link"
import { Header } from "@/components/header"
import { useLanguage } from "@/components/language-provider"
import { siteCopy } from "@/content/site"
import { stripLanguage } from "@/lib/i18n"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { language } = useLanguage()
  const pathname = usePathname()
  const copy = siteCopy[language]

  // The home page ends with the ContactSection, which carries its own
  // statement-footer (copyright + back to top). The shared footer below would
  // duplicate it there, so it only renders on the other routes.
  const showFooter = stripLanguage(pathname) !== "/"

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <AsciiBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        {children}
        {showFooter && (
          <footer className="w-full px-6 md:px-12 lg:px-16 pt-16 pb-8 print:hidden">
            <div className="mx-auto max-w-[90rem] border-t border-border/60 pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between font-mono text-xs text-muted-foreground">
              <p>{copy.footer}</p>
              <DontClickLink className="w-fit transition-colors hover:text-foreground">{copy.dontClickHere}</DontClickLink>
              <div className="md:hidden">
                <BoringToggle />
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}
