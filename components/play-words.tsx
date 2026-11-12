"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import { DotMark } from "@/components/dot-mark"
import { markFound } from "@/lib/secrets"

// Words in the hero you can play with. Each one is also a secret
// (lib/secrets.ts) the first time it is found.

/** "things" in "20, i make things": a click makes it something else. Seeing
 *  every one of them counts as the secret. */
export function ThingsWord({ words }: { words: readonly string[] }) {
  const [at, setAt] = useState(0)
  const seen = useRef(new Set([0]))
  return (
    <button
      type="button"
      className="pill font-mono"
      data-tone="sun"
      onClick={() => {
        const next = (at + 1) % words.length
        setAt(next)
        seen.current.add(next)
        if (seen.current.size === words.length) markFound("things")
      }}
    >
      <DotMark name="shuffle" />
      <span key={at} className="inline-block motion-safe:animate-[note-in_260ms_cubic-bezier(0.2,1.4,0.4,1)]" aria-live="polite">
        {words[at]}
      </span>
    </button>
  )
}

/** "manual": clicked, it answers. */
export function ManualWord({ word, answer }: { word: string; answer: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => setOpen(false), 2600)
    return () => window.clearTimeout(t)
  }, [open])
  return (
    <span className="relative inline">
      <button
        type="button"
        className="play-word"
        aria-describedby={open ? "manual-note" : undefined}
        onClick={() => {
          setOpen(true)
          markFound("manual")
        }}
      >
        {word}
      </button>
      {open && (
        <span id="manual-note" role="status" className="manual-note">
          {answer}
        </span>
      )}
    </span>
  )
}

/** "breaks": under the pointer (or a tap) its letters fall apart, then climb back. */
export function BreaksWord({ word }: { word: string }) {
  const [broken, setBroken] = useState(false)
  const timer = useRef(0)
  const breakIt = () => {
    if (broken) return
    setBroken(true)
    markFound("breaks")
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setBroken(false), 1100)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <span
      className="breaks play-word"
      data-broken={broken}
      role="button"
      tabIndex={0}
      aria-label={word}
      onPointerEnter={breakIt}
      onClick={breakIt}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          breakIt()
        }
      }}
    >
      {[...word].map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="breaks-letter"
          // Each letter falls its own way, the same on every render.
          style={{ "--fall-y": `${0.5 + ((i * 37) % 11) / 9}em`, "--fall-r": `${((i * 53) % 70) - 35}deg` } as CSSProperties}
        >
          {c}
        </span>
      ))}
    </span>
  )
}
