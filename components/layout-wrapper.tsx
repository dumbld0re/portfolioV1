"use client"

import type React from "react"

import { AsciiBackground } from "@/components/ascii-background"
import { Header } from "@/components/header"
import { useLanguage } from "@/components/language-provider"
import { siteCopy } from "@/content/site"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { language } = useLanguage()
  const copy = siteCopy[language]

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <AsciiBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        {children}
        <footer className="w-full px-6 py-6 text-center text-xs text-muted-foreground print:hidden">
          © {new Date().getFullYear()} Danny-Miguel Mittelberger. {copy.footer}
        </footer>
      </div>
    </div>
  )
}
