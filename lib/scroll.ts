import type Lenis from "lenis"

// The page's scroll, whoever runs it: Lenis when it's on (SmoothScroll
// registers itself here), the browser otherwise. Code that moves the page
// goes through scrollPage, so a native smooth scroll never fights Lenis.
let active: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  active = l
}

/** Holds the page still behind a modal, and lets it go again. */
export function lockScroll(locked: boolean) {
  if (locked) active?.stop()
  else active?.start()
  document.documentElement.style.overflow = locked ? "hidden" : ""
}

export function scrollPage(target: number | HTMLElement | null | undefined, offset = 0) {
  if (target == null) return
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (active) {
    active.scrollTo(target, { offset, immediate: still })
    return
  }
  const behavior: ScrollBehavior = still ? "auto" : "smooth"
  if (typeof target === "number") window.scrollTo({ top: target + offset, behavior })
  else target.scrollIntoView({ behavior, block: "start" })
}
