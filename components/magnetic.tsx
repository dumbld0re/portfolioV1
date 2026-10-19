"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const PULL = 0.3

// Leans its child toward the pointer while hovered, then springs back on
// leave. Fine pointers only; reduced-motion users get a still element.
export function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (event.clientX - rect.left - rect.width / 2) * PULL
      const y = (event.clientY - rect.top - rect.height / 2) * PULL
      el.style.transition = "transform 150ms ease-out"
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onLeave = () => {
      el.style.transition = "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)"
      el.style.transform = ""
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <span ref={ref} className={className ?? "inline-block will-change-transform"}>
      {children}
    </span>
  )
}
