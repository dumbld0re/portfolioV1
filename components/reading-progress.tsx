"use client"

import { useEffect, useRef } from "react"

// A vertical hairline that fills as the reader moves through `targetId`.
// Lives in the post's sticky meta column rather than as a fixed bar at the
// viewport edge — Safari tints its toolbars from fixed edge elements.
export function ReadingProgress({ targetId }: { targetId: string }) {
  const fillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const target = document.getElementById(targetId)
    const fill = fillRef.current
    if (!target || !fill) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = target.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.5
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1
      fill.style.transform = `scaleY(${progress})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [targetId])

  return (
    <span aria-hidden="true" className="relative block h-40 w-px bg-border">
      <span ref={fillRef} className="absolute inset-0 origin-top scale-y-0 bg-primary" />
    </span>
  )
}
