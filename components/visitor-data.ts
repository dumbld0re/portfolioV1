"use client"

import { useSyncExternalStore } from "react"

import type { VisitorCounts } from "@/lib/visitors"

// Every visitor number on the page comes from here: the eye count, the
// footer's "N people · from N countries", the phone globe's pill and the
// full globe. One store, so they always agree, and a refresh moves all of
// them at once.
//
// The first read counts this visit (POST, once per page); later reads only
// look (GET): when the globe opens, and when the tab comes back into view.

let data: VisitorCounts | null = null
let started = false
const listeners = new Set<() => void>()

function set(next: VisitorCounts | null) {
  if (!next || typeof next.views !== "number") return
  data = next
  listeners.forEach((l) => l())
}

function load(method: "POST" | "GET") {
  return fetch("/api/views", { method, cache: "no-store" })
    .then((res) => (res.ok ? (res.json() as Promise<VisitorCounts>) : null))
    .then(set)
    .catch(() => {})
}

function start() {
  if (started || typeof window === "undefined") return
  started = true
  load("POST")
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refreshVisitors()
  })
}

/** Fetch the latest numbers (without counting again); every reader updates. */
export function refreshVisitors() {
  return load("GET")
}

function subscribe(listener: () => void) {
  start()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** The site's visitor numbers, or null until they've loaded (or if counting is off). */
export function useVisitorCounts() {
  return useSyncExternalStore(
    subscribe,
    () => data,
    () => null,
  )
}
