"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Which item of a list is "current": the one crossing the middle of the
// viewport while scrolling, or whichever the pointer or focus is on. Feeds the
// sticky panels beside the projects and experience lists.
export function useActiveIndex(count: number) {
  const [active, setActive] = useState(0)
  const nodes = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = nodes.current.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActive(index)
        }
      },
      // A thin band across the middle of the screen.
      { rootMargin: "-45% 0px -45% 0px" },
    )
    nodes.current.slice(0, count).forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
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
