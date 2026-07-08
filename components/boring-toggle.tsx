"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export function BoringToggle() {
  const [boring, setBoring] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("boring") === "1"
    setBoring(stored)
    document.documentElement.classList.toggle("boring", stored)
  }, [])

  const toggle = () => {
    setBoring((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("boring", next)
      localStorage.setItem("boring", next ? "1" : "0")
      return next
    })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={boring}
      aria-label="Toggle boring mode"
      onClick={toggle}
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
