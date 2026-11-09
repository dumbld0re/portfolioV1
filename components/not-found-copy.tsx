"use client"

import Link from "next/link"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { inlineLink } from "@/lib/styles"

// not-found.tsx gets no route params, so its words read the language here.
export function NotFoundLabel() {
  const { language } = useLanguage()

  return <>{siteCopy[language].notFound}</>
}

export function NotFoundHomeLink({ className }: { className?: string }) {
  const { language, localize } = useLanguage()

  return (
    <Link href={localize("/")} className={`${inlineLink} ${className ?? ""}`}>
      <span className="text-primary" aria-hidden="true">
        ←{" "}
      </span>
      {siteCopy[language].home}
    </Link>
  )
}
