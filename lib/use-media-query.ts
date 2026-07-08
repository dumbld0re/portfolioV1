"use client"

import { useSyncExternalStore } from "react"

function subscribe(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query)
    mql.addEventListener("change", callback)
    return () => mql.removeEventListener("change", callback)
  }
}

// useSyncExternalStore (not useState+useEffect) so the browser-only value is
// read without an extra post-mount render, and stays correct if the user
// changes pointer type or motion preference mid-session.
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  )
}
