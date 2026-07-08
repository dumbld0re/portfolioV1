export const BOOT_SEQUENCE_MS = {
  header: 0,
  heroKicker: 100,
  heroName: 250,
  heroSubtitle: 800,
  heroMeta: 950,
  heroScroll: 1100,
} as const

// Module-level so the boot sequence plays once per SPA session and naturally
// resets on a hard reload. Read during render, mark from an effect — mutating
// during render would misfire under StrictMode's double render.
let hasBooted = false

export function hasBootPlayed() {
  return hasBooted
}

export function markBootPlayed() {
  hasBooted = true
}
