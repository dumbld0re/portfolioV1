"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { AsciiBackground } from "@/components/ascii-background"
import { Header } from "@/components/header"
import { useLanguage } from "@/components/language-provider"
import { siteCopy } from "@/content/site"

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
  const showFooter = pathname !== "/"

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <AsciiBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        {children}
        {showFooter && (
          <footer className="w-full px-6 py-6 text-center text-xs text-muted-foreground print:hidden space-y-1">
            <p>{copy.footer}</p>
            <Link
              href="/dont-click-here"
              className="block text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            >
              {copy.dontClickHere}
            </Link>
          </footer>
        )}
      </div>
    </div>
  )
}
