"use client"

import { useSyncExternalStore } from "react"

import { PlainHome } from "@/components/boring/plain-home"
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/boring-store"

// The home page in boring mode. Rendered in the browser only (the mode lives
// in localStorage); the styled site next to it is hidden by CSS from the first
// paint (html.boring .fancy-only), so it never flashes.
export function BoringHome() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return mode === "plain" ? <PlainHome /> : null
}
