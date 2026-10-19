"use client"

import Link from "next/link"

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
