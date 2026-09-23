"use client"

import Link from "next/link"
import { Fragment, useEffect, useLayoutEffect, useRef, type MouseEvent } from "react"

import { elementCenter, useCircleNavigate } from "@/components/circle-transition"
import { useLanguage } from "@/components/language-provider"

const copy = {
  de: {
    heading: "ich sagte doch, nicht klicken.",
    aside: "(ehrlich gesagt wollte ich nur ein bisschen angeben.)",
    back: "zurück",
    status: "neugier: bestätigt",
    marquee: "nicht klicken",
  },
  en: {
    heading: "i said dont click here, silly.",
    aside: "(honestly, i just wanted to show off a little.)",
    back: "go back",
    status: "curiosity: confirmed",
    marquee: "dont click here",
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
      <div
        className="flex justify-between gap-4 whitespace-nowrap px-6 pt-[max(1.5rem,env(safe-area-inset-top))] font-mono text-label uppercase tracking-[0.2em] text-(--egg-fg)/80 md:px-12 motion-safe:animate-fade-up"
        style={{ animationDelay: `${restDelay}ms` }}
      >
        <span>~/dont-click-here</span>
        <span className="hidden sm:inline">{t.status}</span>
      </div>

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

      <Marquee text={t.marquee} delay={restDelay} />
    </main>
  )
}

function BackButton({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const navigate = useCircleNavigate()

  // Magnetic pull toward the pointer — fine pointers only, never with reduced motion.
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate3d(${dx * 0.3}px, ${dy * 0.4}px, 0)`
    }
    const onLeave = () => {
      el.style.transform = ""
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    // Shrink the page back into the button it was left through.
    navigate(href, elementCenter(event.currentTarget), "out")
  }

  return (
    <Link
      ref={ref}
      href={href}
      onClick={handleClick}
      className="group inline-flex items-center gap-3 rounded-full border border-(--egg-fg)/30 px-7 py-4 font-mono text-xs uppercase tracking-[0.25em] transition-[transform,background-color,color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-(--egg-fg) hover:bg-(--egg-fg) hover:text-(--egg-bg) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--egg-fg)"
    >
      <span aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1">
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

function Marquee({ text, delay }: { text: string; delay: number }) {
  const items = Array.from({ length: 8 }, () => text)

  return (
    <div
      aria-hidden="true"
      className="select-none overflow-hidden pb-[max(1.5rem,env(safe-area-inset-bottom))] motion-safe:animate-fade-up"
      style={{ animationDelay: `${delay + 200}ms` }}
    >
      {/* Two identical halves; sliding by -50% loops seamlessly. */}
      <div className="flex w-max motion-safe:animate-marquee">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((item, i) => (
              <span key={i} className="whitespace-nowrap px-6 font-serif text-3xl text-(--egg-fg)/15 md:text-5xl">
                {item} <span className="font-mono text-base align-middle">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
