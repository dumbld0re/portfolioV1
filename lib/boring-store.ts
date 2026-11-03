// Boring mode: "plain" turns the site into an unstyled 1996 HTML document.
// The toggles switch between off and plain.
//
// Stored in localStorage; the inline script in app/[lang]/layout.tsx and
// app/library/layout.tsx (BORING_SCRIPT) reads it before the first paint so
// the styled site never flashes in boring mode.

export type BoringMode = "off" | "plain"

const KEY = "boring"

let listeners: Array<() => void> = []

export function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((listener) => listener !== callback)
  }
}

/** "1" was the old stored value for the greyscale boring mode. */
function parse(value: string | null): BoringMode {
  return value === "1" || value === "plain" ? "plain" : "off"
}

export function getSnapshot(): BoringMode {
  try {
    return parse(localStorage.getItem(KEY))
  } catch {
    return "off"
  }
}

export function getServerSnapshot(): BoringMode {
  return "off"
}

export function setBoringMode(mode: BoringMode) {
  try {
    localStorage.setItem(KEY, mode)
  } catch {}
  listeners.forEach((listener) => listener())
}

/** The on/off switches: on means plain. */
export function setBoring(on: boolean) {
  setBoringMode(on ? "plain" : "off")
}

/**
 * Runs inline in <head>, before the page paints: applies ?boring=plain|off
 * from the URL, then puts the stored mode on <html> as .boring + .boring-<mode>.
 */
export const BORING_SCRIPT = `(function(){try{var d=document.documentElement,s=localStorage,p=new URLSearchParams(location.search).get("boring");if(p==="plain"||p==="off")s.setItem("boring",p);var v=s.getItem("boring");if(v==="1"||v==="plain")d.classList.add("boring","boring-plain")}catch(e){}})()`
