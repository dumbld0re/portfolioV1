"use client"

import Link from "next/link"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { RollText } from "@/components/roll-text"

export function NotFoundHomeLink() {
  const { localize } = useLanguage()

  return (
    <Link
      href={localize("/")}
      className="inline-block font-mono text-sm uppercase tracking-[0.2em] text-primary"
    >
      <RollText>cd ~</RollText>
    </Link>
  )
}

// not-found.tsx gets no route params, so the label reads the language here.
export function NotFoundLabel() {
  const { language } = useLanguage()

  return <>{siteCopy[language].notFound}</>
}
