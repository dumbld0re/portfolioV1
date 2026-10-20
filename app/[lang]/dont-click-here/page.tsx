"use client"

import { useLanguage } from "@/components/language-provider"

const copy = {
  de: "ich hab doch gesagt, nicht klicken.",
  en: "i said dont click here, silly.",
}

export default function DontClickHerePage() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center bg-background text-foreground font-mono text-sm">
      <p>{copy[language]}</p>
    </main>
  )
}
