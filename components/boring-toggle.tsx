"use client"

import { useEffect, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"
import { getServerSnapshot, getSnapshot, setBoring, subscribe } from "@/lib/boring-store"

export function BoringToggle() {
  const boring = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.classList.toggle("boring", boring)
  }, [boring])

  return (
    <button
      type="button"
      role="switch"
      aria-checked={boring}
      aria-label="Toggle boring mode"
      onClick={() => setBoring(!boring)}
      className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <span>Boring</span>
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
