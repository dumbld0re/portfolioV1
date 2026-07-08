"use client"

import { useEffect, useRef } from "react"

import { useMediaQuery } from "@/lib/use-media-query"

const FOLLOW_LERP = 0.3
const SCALE_LERP = 0.25
const INTERACTIVE = "a, button, [role=button], input, textarea, select, label"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const finePointer = useMediaQuery("(pointer: fine)")
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const enabled = finePointer && !reducedMotion

  useEffect(() => {
    if (!enabled) return
    const cursor = cursorRef.current
    if (!cursor) return

    document.documentElement.classList.add("custom-cursor-active")

    let targetX = -100
    let targetY = -100
    let targetScale = 1
    let x = targetX
    let y = targetY
    let scale = 1
    let raf = 0
    let visible = false

    const tick = () => {
      x += (targetX - x) * FOLLOW_LERP
      y += (targetY - y) * FOLLOW_LERP
      scale += (targetScale - scale) * SCALE_LERP
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

      // Loop only runs while catching up to the pointer, then goes idle.
      if (Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1 && Math.abs(targetScale - scale) < 0.01) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!visible) {
        visible = true
        x = targetX
        y = targetY
        cursor.style.opacity = "1"
      }
      const target = event.target as Element | null
      targetScale = target?.closest?.(INTERACTIVE) ? 2 : 1
      wake()
    }

    const onDown = () => {
      targetScale = 0.6
      wake()
    }
    const onUp = () => {
      targetScale = 1
      wake()
    }
    const onLeave = () => {
      visible = false
      cursor.style.opacity = "0"
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.documentElement.addEventListener("mouseleave", onLeave)

    return () => {
      document.documentElement.classList.remove("custom-cursor-active")
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed left-0 top-0 -ml-1.5 -mt-1.5 size-3 rounded-full z-[9999] pointer-events-none print:hidden bg-white mix-blend-difference opacity-0 transition-opacity duration-150 will-change-transform"
    />
  )
}
