"use client"

import { useEffect, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import { eggsContent } from "@/content/eggs"
import { heroName, motionOff } from "@/lib/eggs"
import { markFound } from "@/lib/secrets"

const KONAMI = "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a"
const BROKEN_MS = 3600
/** How long the fallen dots lie there before they get up by themselves. */
const FALLEN_MS = 7000
/** Left alone this long, the name dozes off. */
const IDLE_MS = 60_000

// The hidden things, on every page: typing "hello" or "gravity" (the name in
// the hero answers), any other word and enter (the name spells it), the old
// cheat code (the page falls apart and puts itself back), leaving the tab and
// coming back, and a minute without doing anything (the name dozes off). The
// gravity well (not counted) lives in the name itself
// (components/particle-text.tsx), the dizzy theme switch in lib/theme-flow.ts,
// the hero's words in components/play-words.tsx and 2086 in the footer. Each
// is counted once found (lib/secrets.ts); none of them announces itself.
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
    let word = ""
    let keys: string[] = []
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest("input, textarea, select, [contenteditable]")) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      // Any word, then enter: the name spells it for a moment.
      if (e.key === "Enter") {
        const name = heroName()
        if (name && !motionOff() && word.length >= 2 && word.length <= 14) {
          name.morph([word], 3200)
          markFound("word")
        }
        word = ""
      } else if (/^[\p{L}]$/u.test(e.key)) word = (word + e.key.toLowerCase()).slice(-14)
      else if (e.key !== "Shift") word = ""
      keys = [...keys, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-10)
      if (keys.join(" ") === KONAMI) {
        keys = []
        if (breaking) return
        breaking = true
        markFound("konami")
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
        word = ""
        name.morph(words.greeting, 2800)
        markFound("hello")
      } else if (words.words.gravity.some((w) => typed.endsWith(w))) {
        typed = ""
        word = ""
        fallen = true
        name.fall()
        markFound("gravity")
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
        if (Date.now() - leftAt > 1500) {
          heroName()?.regroup()
          markFound("comeback")
        }
        leftAt = 0
      }
    }

    // A minute of nothing: the name dozes off, and anything wakes it.
    let idleTimer = 0
    let dozing = false
    const active = () => {
      if (dozing) {
        dozing = false
        heroName()?.wake()
      }
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        const name = heroName()
        if (!name || motionOff() || document.hidden) return
        dozing = true
        name.doze()
        markFound("doze")
      }, IDLE_MS)
    }
    active()

    const activity = ["pointermove", "pointerdown", "keydown", "wheel", "scroll", "touchstart"] as const
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", pickUp)
    document.addEventListener("visibilitychange", onVisibility)
    activity.forEach((type) => window.addEventListener(type, active, { passive: true }))
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", pickUp)
      document.removeEventListener("visibilitychange", onVisibility)
      activity.forEach((type) => window.removeEventListener(type, active))
      if (leftAt) document.title = title
      window.clearTimeout(fallTimer)
      window.clearTimeout(idleTimer)
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
