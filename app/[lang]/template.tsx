"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { stripLanguage } from "@/lib/i18n"

// Next remounts template.tsx on every navigation, giving each route a
// consistent enter fade without restructuring the per-page LayoutWrapper.
// Posts open straight away, without it.
export default function Template({ children }: { children: React.ReactNode }) {
  const posts = stripLanguage(usePathname()).startsWith("/posts")
  return <div className={posts ? undefined : "motion-safe:animate-page-fade"}>{children}</div>
}
