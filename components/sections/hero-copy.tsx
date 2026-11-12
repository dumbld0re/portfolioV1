"use client"

import { Fragment, type ReactNode } from "react"

import { DotMark } from "@/components/dot-mark"
import { NamibiaWord } from "@/components/namibia-word"
import { BreaksWord, ManualWord, ThingsWord } from "@/components/play-words"
import type { homeContent } from "@/content/home"
import { INSTAGRAM_URL, PINTEREST_URL, X_URL } from "@/lib/styles"

type Hero = (typeof homeContent)["en"]["hero"]

/**
 * Fills {tokens} in a line of copy (content/home.ts) with what they stand for.
 * A token keeps the punctuation right after it on its line, so "manual."
 * never wraps as "manual" / ".".
 */
export function fill(text: string, parts: Record<string, ReactNode>) {
  return text.split(/(\{\w+\}[.,!?;:]*)/).map((bit, i) => {
    const m = bit.match(/^\{(\w+)\}([.,!?;:]*)$/)
    if (!m || !(m[1] in parts)) return <Fragment key={i}>{bit}</Fragment>
    return (
      <span key={i} className="whitespace-nowrap">
        {parts[m[1]]}
        {m[2]}
      </span>
    )
  })
}

const social = "play-word hover:text-foreground"

// The hero under the name: the tagline in mono, two short lines with the
// places on bright pills (with dot marks) and words to play with, then where
// else to find me.
export function HeroStack({ t }: { t: Hero }) {
  const parts: Record<string, ReactNode> = {
    things: <ThingsWord words={t.things} />,
    manual: <ManualWord word={t.manual.word} answer={t.manual.answer} />,
    breaks: <BreaksWord word={t.breaks} />,
    unam: (
      <a className="pill" data-tone="grape" href="https://www.unam.edu.na" target="_blank" rel="noreferrer">
        <DotMark name="cap" />
        {t.unam}
      </a>
    ),
    linux: (
      <span className="pill cursor-default" data-tone="mint">
        <DotMark name="penguin" />
        {t.linux}
      </span>
    ),
    namibia: <NamibiaWord word={t.namibia.word} place={t.namibia.place} coords={t.namibia.coords} />,
    pinterest: (
      <a className={social} href={PINTEREST_URL} target="_blank" rel="noreferrer">
        pinterest
      </a>
    ),
    x: (
      <a className={social} href={X_URL} target="_blank" rel="noreferrer">
        x
      </a>
    ),
    instagram: (
      <a className={social} href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
        instagram
      </a>
    ),
  }

  return (
    <div className="flex flex-col items-center gap-[clamp(1rem,3svh,1.5rem)]">
      <p className="font-mono text-base text-foreground">
        {t.tagline} <ThingsWord words={t.things} />
      </p>
      <div className="max-w-xl font-mono text-sm leading-7 text-muted-foreground text-balance md:leading-8">
        {t.lines.map((line) => (
          <p key={line}>{fill(line, parts)}</p>
        ))}
      </div>
      <p className="font-mono text-sm text-muted-foreground">{fill(t.socials, parts)}</p>
    </div>
  )
}
