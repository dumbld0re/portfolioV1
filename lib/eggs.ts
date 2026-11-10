import type { ParticleTextHandle } from "@/components/particle-text"

// What the site's easter eggs share (components/easter-eggs.tsx: hello,
// gravity, the old cheat code, the comeback; the gravity well in the name
// itself; the year 2086 in the footer).

// The name in the hero, while it is on the page: the eggs that play with its
// dots reach it through here, from wherever they are triggered.
let name: ParticleTextHandle | null = null

export function setHeroName(handle: ParticleTextHandle | null) {
  name = handle
}

export function heroName() {
  return name
}

/** True while motion is off: reduced motion, "pause animation" or boring mode. */
export function motionOff() {
  const root = document.documentElement
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    root.classList.contains("paused") ||
    root.classList.contains("boring")
  )
}

/** Calls back whenever motionOff() may have changed. */
export function watchMotion(fn: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  const observer = new MutationObserver(fn)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  query.addEventListener("change", fn)
  return () => {
    observer.disconnect()
    query.removeEventListener("change", fn)
  }
}
