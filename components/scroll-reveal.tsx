"use client"

import { usePathname } from "next/navigation"
import { useLayoutEffect } from "react"

// Fades [data-reveal] elements up as they scroll into view. Content is visible
// in the server HTML; only elements still below the fold when the page mounts
// are hidden (before first paint, so nothing flashes) and then revealed by an
// IntersectionObserver. Reduced-motion users get everything immediately.
export function ScrollReveal() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const pending = [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92,
    )
    pending.forEach((el) => el.classList.add("reveal-pending"))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.remove("reveal-pending")
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    )
    pending.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      pending.forEach((el) => el.classList.remove("reveal-pending"))
    }
  }, [pathname])

  return null
}
