"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

// Keeps the browser chrome (iOS status bar / Android toolbar) the same color as
// the page. The static metas in layout.tsx follow the OS scheme; this corrects
// them when the site's own theme toggle disagrees with the OS.
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) return
    const color = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
    if (!color) return
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.content = color
    })
  }, [resolvedTheme])

  return null
}
