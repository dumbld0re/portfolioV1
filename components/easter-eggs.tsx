"use client"

import { useEffect, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import { eggsContent } from "@/content/eggs"
import { heroName, motionOff } from "@/lib/eggs"

const KONAMI = "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a"
const BROKEN_MS = 3600
/** How long the fallen dots lie there before they get up by themselves. */
const FALLEN_MS = 7000

// The hidden things, on every page: typing "hello" or "gravity" (the name in
// the hero answers), the old cheat code (the page falls apart and puts itself
// back), and leaving the tab and coming back. The gravity well lives in the
// name itself (components/particle-text.tsx) and 2086 in the footer. None of
// them announces itself.
export function EasterEggs() {
  const { language } = useLanguage()
  const t = eggsContent[language]
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("broken", broken)
    return () => document.documentElement.classList.remove("broken")
  }, [broken])

  useEffect(() => {
    const words = eggsContent[language]
    let fallen = false
    let fallTimer = 0
    let breaking = false

    // A click picks the fallen dots back up; left alone, they get up anyway.
    const pickUp = () => {
      if (!fallen) return
      fallen = false
      window.clearTimeout(fallTimer)
      heroName()?.rise()
    }

    let typed = ""
    let keys: string[] = []
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return
      keys = [...keys, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-10)
      if (keys.join(" ") === KONAMI) {
        keys = []
        if (breaking) return
        breaking = true
        window.dispatchEvent(new Event("dots:pulse"))
        heroName()?.scatter(60)
        if (!motionOff()) setBroken(true)
        window.setTimeout(() => {
          breaking = false
          setBroken(false)
        }, BROKEN_MS)
        return
      }
      if (e.key.length !== 1) return
      typed = (typed + e.key.toLowerCase()).slice(-14)
      // Both of these play with the name's dots, so they wait for a page that has it.
      const name = heroName()
      if (!name || motionOff()) return
      if (words.words.hello.some((w) => typed.endsWith(w))) {
        typed = ""
        name.morph(words.greeting, 2800)
      } else if (words.words.gravity.some((w) => typed.endsWith(w))) {
        typed = ""
        fallen = true
        name.fall()
        window.clearTimeout(fallTimer)
        fallTimer = window.setTimeout(pickUp, FALLEN_MS)
      }
    }

    let title = ""
    let leftAt = 0
    const onVisibility = () => {
      if (document.hidden) {
        leftAt = Date.now()
        title = document.title
        document.title = words.away
      } else if (leftAt) {
        document.title = title
        if (Date.now() - leftAt > 1500) heroName()?.regroup()
        leftAt = 0
      }
    }

    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", pickUp)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", pickUp)
      document.removeEventListener("visibilitychange", onVisibility)
      if (leftAt) document.title = title
      window.clearTimeout(fallTimer)
    }
  }, [language])

  return (
    <>
      {broken && (
        <div role="alert" className="egg-broke pointer-events-none fixed inset-0 z-[95] flex flex-col items-center justify-center gap-4 text-center">
          <p className="font-serif text-[clamp(2.75rem,10vw,9rem)] lowercase leading-none tracking-[-0.03em]">{t.broke.title}</p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t.broke.note} <span className="text-primary">● ● ●</span>
          </p>
        </div>
      )}
    </>
  )
}
