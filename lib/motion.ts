export const BOOT_SEQUENCE_MS = {
  header: 0,
  heroName: 250,
  heroIntro: 350,
  heroSubtitle: 750,
  heroMeta: 900,
  // the name's dots, once the rest of the hero is in
  heroDots: 1100,
} as const

// Before the first paint: hide the page and hold its animations until
// <BootGate> lifts the class. If the scripts never get that far, the page
// shows anyway after a few seconds.
export const BOOT_GATE_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("booting");setTimeout(function(){d.classList.remove("booting")},4000)})()`

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
