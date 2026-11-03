"use client"

import { useEffect, useSyncExternalStore } from "react"

import { siteCopy } from "@/content/site"
import { useLanguageOrDefault } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { getServerSnapshot, getSnapshot, setBoring, subscribe } from "@/lib/boring-store"

// Mounted in the root layout rather than inside the toggle, so boring mode also
// applies on pages without the header (dont-click-here). The inline head script
// sets the same classes before the first paint; this keeps them in sync after.
export function BoringClassSync() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    // Read the store itself: while hydrating, `mode` is briefly the server's
    // "off", and acting on that would flash the styled site for a frame.
    const current = getSnapshot()
    const root = document.documentElement
    root.classList.toggle("boring", current !== "off")
    root.classList.toggle("boring-plain", current === "plain")
  }, [mode])

  return null
}

export function BoringToggle() {
  const boring = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) !== "off"
  const labels = siteCopy[useLanguageOrDefault()]

  return (
    <button
      type="button"
      role="switch"
      aria-checked={boring}
      aria-label={labels.boringLabel}
      onClick={() => setBoring(!boring)}
      className="-my-3 inline-flex items-center gap-2 py-3 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="lowercase">{labels.boring}</span>
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border transition-colors duration-200",
          boring ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "inline-block size-3.5 rounded-full bg-background shadow-sm transition-transform duration-200 ease-out",
            boring ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  )
}
