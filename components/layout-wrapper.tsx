"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { DotGround } from "@/components/dot-ground"
import { EasterEggs } from "@/components/easter-eggs"
import { BoringHome } from "@/components/boring/boring-home"
import { CornerControls } from "@/components/corner-controls"
import { Header } from "@/components/header"
import { HomeBar } from "@/components/home-bar"
import { PageLoop } from "@/components/page-loop"
import { LetterDialog } from "@/components/letter-form"
import { GlobeDialog } from "@/components/visitor-globe"
import { stripLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
  children: React.ReactNode
  /** "home": the home page's top (languages and theme, no links), for pages
   *  that should look like home, such as the 404. */
  bar?: "home" | "nav"
}

export function LayoutWrapper({ children, bar }: LayoutWrapperProps) {
  const pathname = usePathname()

  // Only the home page has a footer: its HomeFooter carries the footer
  // line itself. Every other page ends on its last line.
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
        {/* The home page has no links up top: the sentence is the way around. */}
        {home || bar === "home" ? <HomeBar /> : <Header />}
        {children}
        {/* The home page loops: the top comes round again below the contact section. */}
        {home && <PageLoop />}
        <CornerControls />
        <LetterDialog />
        <GlobeDialog />
        <EasterEggs />
      </div>
    </div>
    </>
  )
}
