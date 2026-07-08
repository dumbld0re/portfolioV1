"use client"

import { useEffect, useRef } from "react"

// Oversized vertical name pinned to the left edge; slides upward as the page
// scrolls. Sits between the background texture and the content (-z-10 inside
// the layout's z-10 stacking context).
export function GhostName({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = ref.current
        if (el) el.style.transform = `translate3d(0, ${-window.scrollY * 0.25}px, 0)`
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="hidden md:block fixed top-0 -left-12 -z-10 select-none pointer-events-none font-serif font-bold leading-none text-foreground/[0.05] text-[13rem] lg:text-[16rem] [writing-mode:vertical-rl] will-change-transform"
    >
      {text}
    </div>
  )
}
