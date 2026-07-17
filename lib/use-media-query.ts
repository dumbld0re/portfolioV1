"use client"

import { useCallback, useSyncExternalStore } from "react"

// useSyncExternalStore (not useState+useEffect) so the browser-only value is
// read without an extra post-mount render, and stays correct if the user
// changes pointer type or motion preference mid-session. subscribe/getSnapshot
// are memoized on `query` so the store isn't torn down and rebuilt every render.
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
