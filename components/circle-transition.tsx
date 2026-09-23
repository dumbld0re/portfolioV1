"use client"

import { usePathname, useRouter } from "next/navigation"
import { useCallback, useLayoutEffect } from "react"

// Circle-reveal route transitions built on the View Transitions API. The
// browser snapshots the old page, we navigate, and once the new route has
// committed the browser animates between the two snapshots — so there is no
// hand-built overlay to keep in sync with the route change. "in" grows the new
// page out of a point; "out" shrinks the old page back into one. Browsers
// without view transitions (and reduced-motion users) just navigate.

type Direction = "in" | "out"

// Resolves the pending transition's DOM-update promise once the new route has
// committed. Module-level: only one transition can run at a time.
let finishUpdate: (() => void) | null = null
let running = false

// Safety net in case the destination never commits (navigation error).
const MAX_WAIT_MS = 3000

export function useCircleNavigate() {
  const router = useRouter()

  return useCallback(
    (href: string, origin: { x: number; y: number }, direction: Direction) => {
      if (running) return

      const root = document.documentElement
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!document.startViewTransition || reducedMotion) {
        router.push(href)
        return
      }

      running = true
      root.style.setProperty("--circle-x", `${origin.x}px`)
      root.style.setProperty("--circle-y", `${origin.y}px`)
      root.dataset.circle = direction

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            finishUpdate = resolve
            setTimeout(resolve, MAX_WAIT_MS)
            router.push(href)
          }),
      )

      // A skipped transition rejects these; the navigation still happens.
      transition.ready.catch(() => {})
      transition.finished.finally(() => {
        running = false
        finishUpdate = null
        delete root.dataset.circle
      })
    },
    [router],
  )
}

/** Mounted in the root layout: signals the pending transition once a new route commits. */
export function CircleTransitionSignal() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    finishUpdate?.()
    finishUpdate = null
  }, [pathname])

  return null
}

/** Center of an element — the origin for keyboard-triggered clicks, which carry no pointer position. */
export function elementCenter(element: Element) {
  const rect = element.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}
