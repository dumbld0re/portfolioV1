const KEY = "boring"

let listeners: Array<() => void> = []

export function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((listener) => listener !== callback)
  }
}

export function getSnapshot() {
  return localStorage.getItem(KEY) === "1"
}

export function getServerSnapshot() {
  return false
}

export function setBoring(next: boolean) {
  localStorage.setItem(KEY, next ? "1" : "0")
  listeners.forEach((listener) => listener())
}
