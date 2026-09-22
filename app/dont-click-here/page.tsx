"use client"

import Link from "next/link"
import { useEffect } from "react"

import { DONT_CLICK_CLASS } from "@/components/dont-click-link"
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

const LETTER_STAGGER_MS = 40

export default function DontClickHerePage() {
  const { language } = useLanguage()
  const t = copy[language]
  const asideDelay = t.heading.length * LETTER_STAGGER_MS + 600

  // The transition sets this class for a seamless hand-off; set it here too so
  // direct loads invert the browser chrome, and undo it on the way out.
  useEffect(() => {
    document.documentElement.classList.add(DONT_CLICK_CLASS)
    return () => document.documentElement.classList.remove(DONT_CLICK_CLASS)
  }, [])

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-10 px-6 bg-foreground text-background">
      <h1 className="font-serif text-4xl md:text-7xl tracking-tight text-center text-balance" aria-label={t.heading}>
        {t.heading.split(" ").map((word, w, words) => (
          // Words stay unbreakable so the per-letter spans still wrap like text.
          <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
            {word.split("").map((char, c) => {
              const index = words.slice(0, w).join(" ").length + (w > 0 ? 1 : 0) + c
              return (
                <span
                  key={c}
                  className="motion-safe:dont-click-letter inline-block"
                  style={{ animationDelay: `${index * LETTER_STAGGER_MS}ms` }}
                >
                  {char}
                </span>
              )
            })}
            {w < words.length - 1 && " "}
          </span>
        ))}
      </h1>

      <div
        className="motion-safe:dont-click-fade flex flex-col items-center gap-6 font-mono text-sm text-background/60"
        style={{ animationDelay: `${asideDelay}ms` }}
      >
        <p className="text-center">{t.aside}</p>
        <Link href="/" className="uppercase tracking-[0.2em] text-xs transition-opacity hover:opacity-60">
          ← {t.back}
        </Link>
      </div>
    </div>
  )
}
