"use client"

import { useRef, useState } from "react"

import { DotMark } from "@/components/dot-mark"
import { markFound } from "@/lib/secrets"
import { cn } from "@/lib/utils"

// A word in the home page's sentence you can play with. Finding all it can
// be is a secret (lib/secrets.ts).

/** "things" in "making things": a click makes it something else. Seeing
 *  every one of them counts as the secret. */
export function ThingsWord({ words, underline = false }: { words: readonly string[]; underline?: boolean }) {
  const [at, setAt] = useState(0)
  const seen = useRef(new Set([0]))
  return (
    <button
      type="button"
      className={underline ? "group" : "pill font-mono"}
      data-tone={underline ? undefined : "sun"}
      onClick={() => {
        const next = (at + 1) % words.length
        setAt(next)
        seen.current.add(next)
        if (seen.current.size === words.length) markFound("things")
      }}
    >
      {!underline && <DotMark name="shuffle" />}
      {/* The word pops in as an inline-block, which an underline on the
          button wouldn't reach, so the word carries its own. */}
      <span
        key={at}
        data-tone={underline ? "amber" : undefined}
        className={cn(
          "inline-block motion-safe:animate-[note-in_260ms_cubic-bezier(0.2,1.4,0.4,1)]",
          underline && "explore-underline",
        )}
        aria-live="polite"
      >
        {words[at]}
      </span>
    </button>
  )
}
