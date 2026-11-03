"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/boring-store"
import { useMediaQuery } from "@/lib/use-media-query"

const SCALE_LERP = 0.25
const INTERACTIVE = "a, button, [role=button], input, textarea, select, label"

// A plain pointer, just sharper: a single triangle whose tip is the hotspot.
// It tracks the mouse 1:1 (no trailing), and only its size eases — a touch
// larger over anything clickable, a touch smaller while pressed.
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const finePointer = useMediaQuery("(pointer: fine)")
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const boring = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) !== "off"
  const enabled = finePointer && !reducedMotion && !boring

  useEffect(() => {
    if (!enabled) return
    const cursor = cursorRef.current
    if (!cursor) return

    document.documentElement.classList.add("custom-cursor-active")

    let x = -100
    let y = -100
    let targetScale = 1
    let scale = 1
    let hovering = false
    let pressed = false
    let raf = 0
    let visible = false

    const render = () => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    }

    const tick = () => {
      scale += (targetScale - scale) * SCALE_LERP
      render()
      // Only runs while the size is easing, then goes idle.
      if (Math.abs(targetScale - scale) < 0.005) {
        scale = targetScale
        render()
        raf = 0
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const update = () => {
      targetScale = pressed ? 0.85 : hovering ? 1.25 : 1
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (event: MouseEvent) => {
      x = event.clientX
      y = event.clientY
      if (!visible) {
        visible = true
        cursor.style.opacity = "1"
      }
      const target = event.target as Element | null
      hovering = Boolean(target?.closest?.(INTERACTIVE))
      render()
      update()
    }

    const onDown = () => {
      pressed = true
      update()
    }
    const onUp = () => {
      pressed = false
      update()
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
      className="fixed left-0 top-0 z-[9999] pointer-events-none print:hidden mix-blend-difference opacity-0 transition-opacity duration-150 will-change-transform origin-top-left"
    >
      {/* A symmetric notched arrowhead, tilted 25° like a system pointer, with
          softened corners. Its tip sits at (1.5,1.5) in the viewBox (1.4px
          at this size), so the offsets land it exactly on the pointer. */}
      <svg width="18" height="23" viewBox="0 0 19 24" className="-ml-[1.4px] -mt-[1.4px] block" fill="white">
        <path
          d="M1.5 1.5 L16.78 15.34 L7.42 14.19 L2.28 22.1 Z"
          stroke="white"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
