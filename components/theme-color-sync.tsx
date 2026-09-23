"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { stripLanguage } from "@/lib/i18n"

// Keeps the browser chrome (iOS status bar / Android toolbar) the same color as
// the page. The static metas in layout.tsx follow the OS scheme; this corrects
// them when the site's own theme toggle disagrees with the OS.
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()
  // The dont-click-here page is inverted, so the chrome takes the foreground color.
  const token = stripLanguage(pathname) === "/dont-click-here" ? "--foreground" : "--background"

  useEffect(() => {
    if (!resolvedTheme) return
    const color = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
    if (!color) return
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.content = color
    })
  }, [resolvedTheme, token])

  return null
}
