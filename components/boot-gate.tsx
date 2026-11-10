"use client"

import { useEffect } from "react"

// Lifts the blank first frame that BOOT_GATE_SCRIPT sets (see lib/motion.ts):
// once the page is interactive and its fonts are in, everything shows at
// once and the held reveal animations play from the start.
export function BootGate() {
  useEffect(() => {
    let done = false
    document.fonts.ready.then(() => {
      if (done) return
      requestAnimationFrame(() => document.documentElement.classList.remove("booting"))
    })
    return () => {
      done = true
    }
  }, [])
  return null
}
