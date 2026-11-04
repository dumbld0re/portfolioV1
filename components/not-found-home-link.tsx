"use client"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"

// not-found.tsx gets no route params, so the label reads the language here.
export function NotFoundLabel() {
  const { language } = useLanguage()

  return <>{siteCopy[language].notFound}</>
}
