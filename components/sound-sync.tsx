"use client"

import { useEffect } from "react"

import { keepSoundAlive, soundEvent } from "@/lib/sound"

const INTERACTIVE = "a, button, [role=button], [role=switch], summary, label, input, select, textarea"

/** A link or button, or anything else styled as clickable (a card, a canvas
 *  with `cursor-pointer`). The class, not the computed cursor: the custom
 *  cursor hides the real one everywhere on desktop. */
function pressable(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) return null
  return target.closest(`${INTERACTIVE}, [class*="cursor-pointer"]`)
}

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
    // Every press sounds on the way up, not on "click": on a phone that is
    // when the browser lets sound start, and a page that re-renders under the
    // pointer (clicking "posts" again on /posts) swaps the link out between
    // down and up, so no click event comes at all.
    const onUp = (e: PointerEvent) => {
      if (e.button !== 0) return
      const el = pressable(e.target)
      if (!el) soundEvent("tap", 0.5, u(e))
      else if (!el.hasAttribute("data-sound-switch")) soundEvent("click", 0.5, u(e))
    }
    // Enter or Space on a focused link or button: a click with no pointer.
    const onKeyClick = (e: MouseEvent) => {
      if (e.detail !== 0) return
      const el = pressable(e.target)
      if (el && !el.hasAttribute("data-sound-switch")) soundEvent("click", 0.5, 0.5)
    }
    document.addEventListener("pointerover", onOver, { passive: true })
    document.addEventListener("click", onKeyClick, true)
    document.addEventListener("pointerup", onUp, { capture: true, passive: true })
    return () => {
      stopKeeping()
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("click", onKeyClick, true)
      document.removeEventListener("pointerup", onUp, true)
    }
  }, [])
  return null
}
