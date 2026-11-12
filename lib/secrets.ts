import { soundEvent } from "@/lib/sound"

// The easter eggs, counted. Each one found is kept in this browser
// (localStorage), the footer shows "secrets 3/11", and finding them all
// unlocks a wallpaper of the dot name. Order here is the order in the list.

export const SECRETS = [
  "hello", // type "hello"
  "gravity", // type "gravity"
  "konami", // the old cheat code
  "comeback", // leave the tab and come back
  "word", // type any word, press enter
  "doze", // leave the page alone for a minute
  "dizzy", // switch the theme five times in a row
  "things", // click "things" until it has been everything
  "manual", // click "manual"
  "breaks", // point at "breaks"
  "2086", // the year in the footer
] as const

export type Secret = (typeof SECRETS)[number]

const KEY = "secrets"

let found: Secret[] = []
let loaded = false
let listeners: Array<() => void> = []

function load() {
  if (loaded || typeof window === "undefined") return
  loaded = true
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    if (Array.isArray(raw)) found = SECRETS.filter((s) => raw.includes(s))
  } catch {}
}

export function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((listener) => listener !== callback)
  }
}

export function getSnapshot(): readonly Secret[] {
  load()
  return found
}

const EMPTY: readonly Secret[] = []
export function getServerSnapshot(): readonly Secret[] {
  return EMPTY
}

/** Marks a secret found. The first time: a chime, a note and the counter ticks. */
export function markFound(id: Secret) {
  load()
  if (found.includes(id)) return
  found = SECRETS.filter((s) => s === id || found.includes(s))
  try {
    localStorage.setItem(KEY, JSON.stringify(found))
  } catch {}
  listeners.forEach((listener) => listener())
  soundEvent("found")
  showToast(found.length === SECRETS.length ? "all secrets found" : `secret ${found.length}/${SECRETS.length}`)
}

/** Forgets every secret found (for trying them all again). */
export function resetSecrets() {
  found = []
  try {
    localStorage.removeItem(KEY)
  } catch {}
  listeners.forEach((listener) => listener())
}

// ---------------------------------------------------------------- a small note

let toastTimer = 0

/** A short mono note at the bottom of the screen, gone after a moment. */
export function showToast(text: string, ms = 2400) {
  if (typeof document === "undefined") return
  let el = document.getElementById("egg-toast")
  if (!el) {
    el = document.createElement("div")
    el.id = "egg-toast"
    el.setAttribute("role", "status")
    el.className = "egg-toast"
    document.body.appendChild(el)
  }
  el.textContent = text
  el.dataset.shown = "true"
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    if (el) el.dataset.shown = "false"
  }, ms)
}
