"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { AsciiBackground } from "@/components/ascii-background"
import { BoringHome } from "@/components/boring/boring-home"
import { BoringToggle } from "@/components/boring-toggle"
import { CornerControls } from "@/components/corner-controls"
import { DontClickLink } from "@/components/dont-click-link"
import { Header } from "@/components/header"
import { useLanguage } from "@/components/language-provider"
import { siteCopy } from "@/content/site"
import { stripLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

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
  const home = stripLanguage(pathname) === "/"
  const showFooter = !home

  // .site: restyled as plain HTML in boring mode (globals.css). The home page
  // goes further: boring mode swaps it for a whole other document.
  return (
    <>
    {home && <BoringHome />}
    <div className={cn("site relative min-h-screen flex flex-col bg-background", home && "fancy-only")}>
      <AsciiBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        {children}
        <CornerControls />
        {showFooter && (
          <footer className="w-full px-6 md:px-12 pt-16 pb-8 lg:pb-16 print:hidden">
            <div className="mx-auto max-w-[90rem] border-t border-border/60 pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between font-mono text-xs text-muted-foreground">
              <p>{copy.footer}</p>
              <DontClickLink className="w-fit transition-colors hover:text-foreground">{copy.dontClickHere}</DontClickLink>
              <div className="lg:hidden">
                <BoringToggle />
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
    </>
  )
}
