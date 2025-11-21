"use client"

import type React from "react"

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
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        {children}
        <footer className="w-full px-6 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Danny-Miguel Mittelberger. {copy.footer}
        </footer>
      </div>
    </div>
  )
}
