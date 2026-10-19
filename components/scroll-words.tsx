"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const DIM = 0.16

// A statement that "reads itself" as it scrolls through the viewport: each
// word brightens in turn from DIM to full opacity. Reduced-motion users (and
// the server HTML) get the plain, fully legible text.
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const words = [...el.querySelectorAll<HTMLSpanElement>("[data-word]")]
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the block's top hits 85% of the viewport, 1 when its bottom hits 45%.
      const start = vh * 0.85
      const end = vh * 0.45
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height)))
      const lit = progress * words.length
      words.forEach((word, i) => {
        const t = Math.min(1, Math.max(0, lit - i))
        word.style.opacity = String(DIM + (1 - DIM) * t)
      })
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
  }, [text])

  return (
    <p ref={ref} className={cn("text-balance", className)}>
      {text.split(/\s+/).map((word, i) => (
        <span key={i} data-word className="transition-opacity duration-150">
          {word}{" "}
        </span>
      ))}
    </p>
  )
}
