"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { stripLanguage } from "@/lib/i18n"

// Next remounts template.tsx on every navigation, giving each route a
// consistent enter fade without restructuring the per-page LayoutWrapper.
export default function Template({ children }: { children: React.ReactNode }) {
  const path = stripLanguage(usePathname())
  // Posts open straight away; the projects pages are carried by their view
  // transition (a fade here would hide the hero the picture morphs into).
  const still = path.startsWith("/posts") || path.startsWith("/projects")
  return <div className={still ? undefined : "motion-safe:animate-page-fade"}>{children}</div>
}
