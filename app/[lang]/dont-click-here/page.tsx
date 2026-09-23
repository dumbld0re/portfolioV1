"use client"

import Link from "next/link"
import { Fragment, useLayoutEffect, type MouseEvent } from "react"

import { elementCenter, useCircleNavigate } from "@/components/circle-transition"
import { useLanguage } from "@/components/language-provider"

const copy = {
  de: {
    heading: "ich sagte doch, nicht klicken.",
    aside: "(ehrlich gesagt wollte ich nur ein bisschen angeben.)",
    back: "zurück",
  },
  en: {
    heading: "i said dont click here, silly.",
    aside: "(honestly, i just wanted to show off a little.)",
    back: "go back",
  },
}

/** On <html> while this page is mounted: paints the root background and browser chrome amber (globals.css). */
const ACTIVE_CLASS = "dont-click-active"

// Choreography (ms). Words start rising while the circle reveal is still
// opening, so the page never sits empty.
const WORDS_START = 350
const WORD_STAGGER = 70
const AFTER_WORDS = 250

export default function DontClickHerePage() {
  const { language, localize } = useLanguage()
  const t = copy[language]
  const words = t.heading.split(" ")
  const restDelay = WORDS_START + words.length * WORD_STAGGER + AFTER_WORDS

  // Layout effect so the class is in place before a view transition snapshots
  // the new page; cleanup runs before the snapshot on the way out.
  useLayoutEffect(() => {
    document.documentElement.classList.add(ACTIVE_CLASS)
    return () => document.documentElement.classList.remove(ACTIVE_CLASS)
  }, [])

  return (
    <main className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-(--egg-bg) text-(--egg-fg)">
      <p
        className="px-6 pt-[max(1.5rem,env(safe-area-inset-top))] font-mono text-label uppercase tracking-[0.2em] text-(--egg-fg)/80 md:px-12 motion-safe:animate-fade-up"
        style={{ animationDelay: `${restDelay}ms` }}
      >
        ~/dont-click-here
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6">
        <h1
          className="max-w-5xl text-center font-serif text-5xl leading-[1.05] tracking-tight text-balance md:text-8xl"
          aria-label={t.heading}
        >
          {words.map((word, i) => (
            // The outer span masks the word; the inner one rises into view.
            // Padding keeps descenders (y, comma) from being clipped. The space
            // sits between the masks — inside an inline-block it would collapse.
            <Fragment key={i}>
              {i > 0 && " "}
              <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
                <span
                  className="inline-block origin-bottom-left motion-safe:animate-word-rise"
                  style={{ animationDelay: `${WORDS_START + i * WORD_STAGGER}ms` }}
                >
                  {word}
                </span>
              </span>
            </Fragment>
          ))}
        </h1>

        <p
          className="max-w-md text-center font-mono text-sm text-(--egg-fg)/80 motion-safe:animate-fade-up"
          style={{ animationDelay: `${restDelay}ms` }}
        >
          {t.aside}
        </p>

        <div className="motion-safe:animate-fade-up" style={{ animationDelay: `${restDelay + 120}ms` }}>
          <BackButton href={localize("/")} label={t.back} />
        </div>
      </div>

      {/* Balances the path label so the content stays optically centered. */}
      <div aria-hidden="true" className="h-[max(2.5rem,calc(env(safe-area-inset-bottom)+1rem))]" />
    </main>
  )
}

function BackButton({ href, label }: { href: string; label: string }) {
  const navigate = useCircleNavigate()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    // Shrink the page back into the link it was left through.
    navigate(href, elementCenter(event.currentTarget), "out")
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group inline-flex items-center gap-3 py-2 font-mono text-xs uppercase tracking-[0.25em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--egg-fg)"
    >
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1.5"
      >
        ←
      </span>
      {/* Text roll: the label slides up and an identical copy follows it in. */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
        >
          {label}
        </span>
      </span>
    </Link>
  )
}
