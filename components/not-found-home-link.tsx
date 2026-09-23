"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"

export function NotFoundHomeLink() {
  const { localize } = useLanguage()

  return (
    <Link
      href={localize("/")}
      className="inline-block font-mono text-sm uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-60"
    >
      cd ~
    </Link>
  )
}
