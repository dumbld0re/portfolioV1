"use client"

import Link from "next/link"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { inlineLink } from "@/lib/styles"

/** "← back to the start", in the visitor's language. */
export function HomeLink({ className = "" }: { className?: string }) {
  const { language, localize } = useLanguage()
  return (
    <Link href={localize("/")} className={`${inlineLink} font-mono text-sm text-muted-foreground ${className}`}>
      <span className="text-primary" aria-hidden="true">
        ←{" "}
      </span>
      {siteCopy[language].home}
    </Link>
  )
}
