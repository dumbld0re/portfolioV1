"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { DotGround } from "@/components/dot-ground"
import { EasterEggs } from "@/components/easter-eggs"
import { BoringHome } from "@/components/boring/boring-home"
import { CornerControls } from "@/components/corner-controls"
import { Header } from "@/components/header"
import { LetterDialog } from "@/components/letter-form"
import { SiteFooter } from "@/components/site-footer"
import { stripLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()

  // The home page ends with the ContactSection, which carries the footer line
  // itself, so it only renders here on the other routes.
  const home = stripLanguage(pathname) === "/"

  // .site: restyled as plain HTML in boring mode (globals.css). The home page
  // goes further: boring mode swaps it for a whole other document.
  return (
    <>
    {home && <BoringHome />}
    {/* Everything on the site is written lowercase; form fields keep what is typed. */}
    <div className={cn("site relative flex min-h-screen flex-col bg-background lowercase", home && "fancy-only")}>
      <DotGround />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        {children}
        <CornerControls />
        <LetterDialog />
        <EasterEggs />
        {!home && (
          <footer className="w-full px-6 md:px-12 pt-16 pb-8 lg:pb-16 print:hidden">
            <SiteFooter className="mx-auto max-w-[90rem]" />
          </footer>
        )}
      </div>
    </div>
    </>
  )
}
