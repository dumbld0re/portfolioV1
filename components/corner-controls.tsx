"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { siteCopy } from "@/content/site"
import { useLanguageOrDefault } from "@/components/language-provider"
import { openLetter } from "@/components/letter-form"
import { getServerSnapshot, getSnapshot, setBoring, subscribe } from "@/lib/boring-store"

const PAUSE_KEY = "paused"

function readPaused() {
  try {
    return localStorage.getItem(PAUSE_KEY) === "1"
  } catch {
    return false
  }
}

const corner =
  "fixed bottom-4 z-40 hidden lg:flex items-center gap-6 rounded-full bg-background/85 px-4 py-1.5 font-mono text-sm backdrop-blur-sm print:hidden"
const control = "text-muted-foreground transition-colors hover:text-foreground"

// Small text controls pinned to the bottom corners on wide screens. Phones and
// tablets get the boring toggle in the page footer instead, where it can't
// cover the content.
export function CornerControls() {
  const labels = siteCopy[useLanguageOrDefault()]
  const boring = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) !== "off"
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    // Restoring a stored preference after hydration, not deriving state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPaused(readPaused())
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("paused", paused)
  }, [paused])

  const togglePaused = () => {
    const next = !paused
    setPaused(next)
    try {
      localStorage.setItem(PAUSE_KEY, next ? "1" : "0")
    } catch {}
  }

  return (
    <>
      <div className={`${corner} left-3`}>
        <button type="button" onClick={openLetter} aria-haspopup="dialog" className={control}>
          {labels.sayHello}
          <span className="text-primary" aria-hidden="true">
            {" "}
            ↗
          </span>
        </button>
      </div>
      <div className={`${corner} right-3`}>
        <button
          type="button"
          role="switch"
          aria-checked={boring}
          aria-label={labels.boringLabel}
          onClick={() => setBoring(!boring)}
          className={control}
        >
          {labels.boring.toLowerCase()}: <span className={boring ? "text-primary" : undefined}>{boring ? labels.on : labels.off}</span>
        </button>
        <button type="button" aria-pressed={paused} onClick={togglePaused} className={control}>
          {paused ? labels.playAnimation : labels.pauseAnimation}
        </button>
      </div>
    </>
  )
}
