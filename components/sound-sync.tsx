"use client"

import { useEffect } from "react"

import { keepSoundAlive, soundEvent } from "@/lib/sound"

const INTERACTIVE = "a, button, [role=button], [role=switch], summary, label, input, select, textarea"

// The site-wide sounds (lib/sound.ts), on every page of both layouts: links
// and buttons blip under a mouse and click when pressed, a press anywhere
// else taps. Nothing plays while sound is off.
export function SoundSync() {
  useEffect(() => {
    const stopKeeping = keepSoundAlive()
    const u = (e: MouseEvent) => e.clientX / window.innerWidth
    let current: Element | null = null
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null
      if (el && el !== current) soundEvent("hover", 0.5, u(e))
      current = el
    }
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE)
      if (el && !el.hasAttribute("data-sound-switch")) soundEvent("click", 0.5, u(e))
    }
    // On the way up, not down: on a phone that is when the browser lets sound start.
    const onUp = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as Element | null)?.closest?.(INTERACTIVE)) return
      soundEvent("tap", 0.5, u(e))
    }
    document.addEventListener("pointerover", onOver, { passive: true })
    document.addEventListener("click", onClick, true)
    document.addEventListener("pointerup", onUp, { passive: true })
    return () => {
      stopKeeping()
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("pointerup", onUp)
    }
  }, [])
  return null
}
