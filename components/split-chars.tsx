import { Fragment } from "react"

import { cn } from "@/lib/utils"

const STAGGER_MS = 30
const MAX_DELAY_MS = 700

// Display heading whose letters rise one by one out of clipping boxes (the
// char-rise keyframes in globals.css). Words stay unbreakable so the line
// wraps between them, never mid-word. Screen readers get the plain text.
export function SplitChars({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ")
  let index = 0

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {/* Spaces sit between the word boxes so the line can wrap there. */}
            {wi > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((char) => {
                const i = index++
                return (
                  <span key={i} className="inline-block overflow-hidden pb-[0.3em] -mb-[0.3em] align-bottom">
                    <span
                      className={cn("inline-block motion-safe:animate-char-rise", char === "-" && "text-primary")}
                      style={{ animationDelay: `${delay + Math.min(i * STAGGER_MS, MAX_DELAY_MS)}ms` }}
                    >
                      {char}
                    </span>
                  </span>
                )
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  )
}
