"use client"

import { useEffect } from "react"

// Keeps the browser chrome (iOS status bar / Android toolbar) the same color as
// the page. The static metas in layout.tsx follow the OS scheme; this mirrors
// <html>'s actual background whenever its classes change — the theme (dark),
// boring mode's grayscale and the amber dont-click-here page all live there.
export function ThemeColorSync() {
  useEffect(() => {
    const root = document.documentElement

    const sync = () => {
      const color = getComputedStyle(root).backgroundColor
      if (!color) return
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
        meta.content = color
      })
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return null
}
