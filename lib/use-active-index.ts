"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Which item of a list is "current": the one crossing the middle of the
// viewport, or whichever the pointer or focus is on. Feeds the sticky
// timeline beside the experience list.
//
// Measured from the items' positions on every scroll frame rather than with
// an IntersectionObserver band, so a fast scroll (or a jump to an anchor)
// can't skip over items and leave a stale one lit.
export function useActiveIndex(count: number) {
  const [active, setActive] = useState(0)
  const nodes = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const middle = window.innerHeight / 2
      let best = -1
      let bestDistance = Infinity
      nodes.current.slice(0, count).forEach((node, i) => {
        if (!node) return
        const r = node.getBoundingClientRect()
        // Inside the item: it's the one. Otherwise, the nearest edge wins.
        const distance = r.top <= middle && r.bottom >= middle ? 0 : Math.min(Math.abs(r.top - middle), Math.abs(r.bottom - middle))
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      if (best >= 0) setActive(best)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    frame = requestAnimationFrame(measure)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [count])

  const register = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      nodes.current[index] = node
    },
    [],
  )

  // Spread onto each item so hover and keyboard focus also select it.
  const bind = useCallback(
    (index: number) => ({
      ref: register(index),
      onMouseEnter: () => setActive(index),
      onFocus: () => setActive(index),
    }),
    [register],
  )

  return { active, bind }
}
