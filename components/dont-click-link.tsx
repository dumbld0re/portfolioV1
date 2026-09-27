"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import { useLanguage } from "@/components/language-provider"

export function DontClickLink({ className, children }: { className?: string; children: ReactNode }) {
  const href = useLanguage().localize("/dont-click-here")

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
