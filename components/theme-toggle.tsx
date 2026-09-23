"use client"

import { useState, useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // Theme is unknown until mounted; render a fixed icon on the server to
  // avoid a hydration mismatch.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
  // Only animate icons after a click, not when the real theme resolves on load.
  const [switched, setSwitched] = useState(false)
  const swap = switched ? "motion-safe:animate-icon-swap" : undefined

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground hover:text-foreground"
      onClick={() => {
        setSwitched(true)
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }}
      aria-label="Toggle theme"
    >
      {/* Keyed so the icon remounts and spins in on every switch. */}
      {mounted && resolvedTheme === "light" ? (
        <Sun key="sun" className={cn("size-4", swap)} />
      ) : (
        <Moon key="moon" className={cn("size-4", swap)} />
      )}
    </Button>
  )
}
