"use client"

import { useEffect } from "react"

// Keeps theme-color (Android toolbar, Safari before 26) the same color as the
// page. The static metas in layout.tsx follow the OS scheme; this mirrors
// <html>'s actual background whenever its classes change (the theme lives
// there). Safari 26 ignores theme-color and tints from the body background.
export function ThemeColorSync() {
  useEffect(() => {
    const root = document.documentElement

    const sync = () => {
      const color = getComputedStyle(root).backgroundColor
      // A transparent value would make browsers fall back to white bars.
      if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") return
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
