"use client"

import { useCallback, useSyncExternalStore } from "react"

import { isSort, type Sort } from "@/lib/library-query"

// The index's state lives in the URL — ?q=topic:ai&sort=date#AI.003 — so any
// filtered view or open entry can be shared. The page is static, so the URL is
// read on the client through a tiny external store instead of searchParams.
const EVENT = "library-url"

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback)
  window.addEventListener("hashchange", callback)
  window.addEventListener(EVENT, callback)
  return () => {
    window.removeEventListener("popstate", callback)
    window.removeEventListener("hashchange", callback)
    window.removeEventListener(EVENT, callback)
  }
}

const getSnapshot = () => window.location.search + window.location.hash
const getServerSnapshot = () => ""

export type LibraryUrlState = { query: string; sort: Sort; open: string | null }

export function useLibraryUrl() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [search = "", hash = ""] = snapshot.split("#")
  const params = new URLSearchParams(search)
  const sort = params.get("sort")

  const state: LibraryUrlState = {
    query: params.get("q") ?? "",
    sort: isSort(sort) ? sort : "a-z",
    open: hash ? decodeURIComponent(hash) : null,
  }

  const update = useCallback((next: Partial<LibraryUrlState>) => {
    const params = new URLSearchParams(window.location.search)
    const current = decodeURIComponent(window.location.hash.slice(1)) || null

    if (next.query !== undefined) {
      if (next.query.trim()) params.set("q", next.query)
      else params.delete("q")
    }
    if (next.sort !== undefined) {
      if (next.sort === "a-z") params.delete("sort")
      else params.set("sort", next.sort)
    }
    const open = next.open !== undefined ? next.open : current

    const search = params.toString()
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${open ? `#${open}` : ""}`
    // replaceState, not a router push: typing in the filter shouldn't stack
    // history entries or re-run the (static) page on the server.
    window.history.replaceState(window.history.state, "", url)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return [state, update] as const
}
