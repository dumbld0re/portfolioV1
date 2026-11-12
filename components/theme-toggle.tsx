"use client"

import { useState, useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { eggsContent } from "@/content/eggs"
import { siteCopy } from "@/content/site"
import { useLanguageOrDefault } from "@/components/language-provider"
import { flowTheme } from "@/lib/theme-flow"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const language = useLanguageOrDefault()
  const labels = siteCopy[language]
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
    <button
      type="button"
      className="-m-1.5 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary md:m-0 md:size-8 dark:hover:bg-accent/50"
      onClick={(e) => {
        const next = resolvedTheme === "dark" ? "light" : "dark"
        // The new theme pours out of the button in dots (lib/theme-flow.ts).
        void flowTheme(
          e.currentTarget,
          next,
          () => {
            setSwitched(true)
            setTheme(next)
          },
          eggsContent[language].dizzy,
        )
      }}
      aria-label={labels.themeLabel}
    >
      {/* Keyed so the icon remounts and spins in on every switch. */}
      {mounted && resolvedTheme === "light" ? (
        <Sun key="sun" className={cn("size-4", swap)} />
      ) : (
        <Moon key="moon" className={cn("size-4", swap)} />
      )}
    </button>
  )
}
