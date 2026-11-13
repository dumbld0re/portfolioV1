"use client"

import { Infinity as InfinityIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState, useSyncExternalStore } from "react"

import { siteCopy } from "@/content/site"
import { useHasLanguages, useLanguageOrDefault } from "@/components/language-provider"
import { LanguageSwitch } from "@/components/language-switch"
import { openLetter } from "@/components/letter-form"
import { getServerSnapshot, getSnapshot, setBoring, subscribe } from "@/lib/boring-store"
import { stripLanguage } from "@/lib/i18n"
import * as loop from "@/lib/loop-store"
import * as sound from "@/lib/sound"
import { cn } from "@/lib/utils"

const corner =
  "fixed bottom-4 z-40 hidden lg:flex items-center gap-6 rounded-full bg-background/85 px-4 py-1.5 font-mono text-sm backdrop-blur-sm print:hidden"
const control = "text-muted-foreground transition-colors hover:text-foreground"

// Small text controls pinned to the bottom corners on wide screens. Phones and
// tablets get the boring toggle in the page footer instead, where it can't
// cover the content; there, only the language switch sits in the corner. It
// shows once the header is out of sight, so the language can be changed from
// anywhere on the page.
export function CornerControls() {
  const labels = siteCopy[useLanguageOrDefault()]
  const languages = useHasLanguages()
  const boring = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) !== "off"
  const loopOn = useSyncExternalStore(loop.subscribe, loop.getSnapshot, loop.getServerSnapshot)
  // Only the home page loops (components/page-loop.tsx).
  const home = stripLanguage(usePathname()) === "/"
  const soundOn = useSyncExternalStore(sound.subscribe, sound.getSnapshot, sound.getServerSnapshot)

  // The hero has its own email icon in this corner of the screen, so "say
  // hello" only comes in once that row has scrolled away. Hidden until the
  // page has been checked, so it never flashes over the hero on load.
  const [hello, setHello] = useState(false)

  useEffect(() => {
    // On the home page there are two: the hero and its loop echo at the foot
    // (components/page-loop.tsx); "say hello" waits until neither is in view.
    const links = [...document.querySelectorAll("[data-hero-links]")]
    if (!links.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHello(true)
      return
    }
    const seen = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) seen.add(entry.target)
        else seen.delete(entry.target)
      }
      setHello(seen.size === 0)
    })
    links.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // Looked up again when the loop's echo comes or goes.
  }, [loopOn])

  // The header has its own language link, so the one down here only comes
  // in once the header has scrolled off the screen. On phones and tablets the
  // footer carries the languages too, so the floating one steps aside again
  // when the footer comes into view, instead of sitting on top of it.
  const [headerGone, setHeaderGone] = useState(false)
  const [footerHere, setFooterHere] = useState(false)
  useEffect(() => {
    // The home page's loop echo carries a second header (components/page-loop.tsx).
    const headers = [...document.querySelectorAll("header")]
    const footer = document.querySelector("[data-site-footer]")
    const seen = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === footer) setFooterHere(entry.isIntersecting)
        else if (entry.isIntersecting) seen.add(entry.target)
        else seen.delete(entry.target)
      }
      setHeaderGone(seen.size === 0)
    })
    headers.forEach((el) => observer.observe(el))
    if (footer) observer.observe(footer)
    return () => observer.disconnect()
  }, [loopOn])
  const languageSwitch = languages && headerGone
  const floating = languageSwitch && !footerHere
  const fade = (shown: boolean) => cn("transition-opacity duration-300", !shown && "pointer-events-none opacity-0")

  return (
    <>
      <div
        className={cn(corner, "left-3 transition-opacity duration-300", !hello && "pointer-events-none opacity-0")}
        inert={!hello}
      >
        <button type="button" onClick={openLetter} aria-haspopup="dialog" className={control}>
          {labels.sayHello}
          <span className="text-primary" aria-hidden="true">
            {" "}
            ↗
          </span>
        </button>
      </div>
      {languages && (
        <div
          inert={!floating}
          className={cn(
            "fixed bottom-3 right-3 z-40 flex items-center rounded-full bg-background/85 px-2 font-mono text-sm text-muted-foreground backdrop-blur-sm lg:hidden print:hidden",
            fade(floating),
          )}
        >
          <LanguageSwitch className={cn(control, "px-2 py-2.5")} currentClassName="px-2 py-2.5" />
        </div>
      )}
      <div className={`${corner} right-3`}>
        {languages && (
          <span inert={!languageSwitch} className={cn("flex items-center gap-2.5 text-muted-foreground", fade(languageSwitch))}>
            <LanguageSwitch className={control} />
          </span>
        )}
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
        <button
          type="button"
          role="switch"
          aria-checked={soundOn}
          aria-label={labels.soundLabel}
          data-sound-switch=""
          onClick={() => sound.setSound(!soundOn)}
          className={control}
        >
          {labels.sound}: <span className={soundOn ? "text-primary" : undefined}>{soundOn ? labels.on : labels.off}</span>
        </button>
        {home && (
          <button
            type="button"
            role="switch"
            aria-checked={loopOn}
            aria-label={labels.loopLabel}
            title={labels.loopLabel.toLowerCase()}
            onClick={() => loop.setLoop(!loopOn)}
            className={cn(control, "-my-1 py-1", loopOn && "text-primary hover:text-primary")}
          >
            <InfinityIcon aria-hidden="true" className="size-[1.15em]" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </>
  )
}
