// The home page's endless scroll (components/page-loop.tsx), switched by the
// ∞ corner control. Off until turned on; the choice is kept in localStorage.

const KEY = "loop"

let listeners: Array<() => void> = []

export function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((listener) => listener !== callback)
  }
}

export function getSnapshot(): boolean {
  try {
    return localStorage.getItem(KEY) === "on"
  } catch {
    return false
  }
}

export function getServerSnapshot(): boolean {
  return false
}

export function setLoop(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off")
  } catch {}
  listeners.forEach((listener) => listener())
}
