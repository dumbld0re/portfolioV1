"use client"

import Lenis from "lenis"
import { useEffect } from "react"
import { setLenis } from "@/lib/scroll"

// Smooth wheel and trackpad scrolling everywhere (Lenis): the page glides to
// a stop instead of jumping a notch at a time. Touch screens keep their
// native scroll (it already has momentum). Off under reduced motion, in
// boring mode, and on the timeline, which pages one year per scroll by
// itself (it marks <html> with .tl-html while it's mounted).
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis: Lenis | null = null

    const sync = () => {
      const want =
        !still.matches && !root.classList.contains("boring") && !root.classList.contains("tl-html")
      if (want && !lenis) {
        lenis = new Lenis({
          autoRaf: true,
          lerp: 0.1,
          anchors: true,
          allowNestedScroll: true,
          prevent: (node) => node.nodeName === "IFRAME" || !!node.closest?.("[data-lenis-prevent]"),
        })
        setLenis(lenis)
      } else if (!want && lenis) {
        lenis.destroy()
        lenis = null
        setLenis(null)
      }
    }

    sync()
    // the timeline and the boring toggle both flip classes on <html>
    const mo = new MutationObserver(sync)
    mo.observe(root, { attributes: true, attributeFilter: ["class"] })
    still.addEventListener("change", sync)
    return () => {
      mo.disconnect()
      still.removeEventListener("change", sync)
      lenis?.destroy()
      setLenis(null)
    }
  }, [])

  return null
}
