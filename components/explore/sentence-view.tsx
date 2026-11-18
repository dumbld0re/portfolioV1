"use client"

import { Fragment, type CSSProperties } from "react"

import { exploreContent, type SectionId } from "@/content/explore"
import { homeContent } from "@/content/home"
import { DotMark } from "@/components/dot-mark"
import { useLanguage } from "@/components/language-provider"
import { openLetter } from "@/components/letter-form"
import { NamibiaWord } from "@/components/namibia-word"
import { ParticleText } from "@/components/particle-text"
import { ThingsWord } from "@/components/play-words"
import { Reader } from "@/components/explore/reader"
import { useExploreState, useShelf, type ExploreData, type ShelfSection } from "@/components/explore/shelf"
import { HomeFooter } from "@/components/sections/home-footer"
import { setHeroName } from "@/lib/eggs"
import { cn } from "@/lib/utils"

// The home page: my name in dots, and under it one sentence about me whose
// pills are the way in. Through a pill the sentence doesn't go away; it moves
// into the left column, small, with the pill you came through lit and the
// others faded but still clickable, so you can walk from place to place by
// the sentence alone. The sentence and its pills morph between the two (view
// transitions: each pill and underlined word flies to its new spot like a
// piece across a board, the words between them fade). Inside a place there
// is no footer.

const name = (id: string): CSSProperties => ({ viewTransitionName: id })

const NO_DATA: ExploreData = { posts: [], library: [] }

function Sentence({
  sections,
  active,
  compact,
  onPick,
}: {
  sections: ShelfSection[]
  active: SectionId | null
  compact?: boolean
  onPick: (id: SectionId) => void
}) {
  const { language } = useLanguage()
  const { sentence, sentenceWords: words, hi } = exploreContent[language]
  const hero = homeContent[language].hero
  const byId = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<SectionId, ShelfSection>

  return (
    <p
      className={cn(
        "font-serif text-balance lowercase",
        compact
          ? "text-lg leading-[1.75] text-muted-foreground"
          : "text-center text-[clamp(1.25rem,0.9rem+1.1vw,1.875rem)] leading-[1.6] tracking-[-0.01em] text-foreground",
      )}
    >
      {sentence.split(/(\{\w+\}[.,]?)/).map((bit, i) => {
        const m = bit.match(/^\{(\w+)\}([.,]?)$/)
        if (!m) return <Fragment key={i}>{bit}</Fragment>
        // The two words that aren't places: the map, and the word that
        // changes. Both underlined, like most of the places.
        if (m[1] === "namibia" || m[1] === "things") {
          return (
            <span key={i} className="whitespace-nowrap">
              <span
                style={name(`explore-word-${m[1]}`)}
                className={cn(
                  "explore-vt inline-block transition-opacity",
                  active && (m[1] === "namibia" ? "opacity-45" : "opacity-45 hover:opacity-100"),
                )}
              >
                {m[1] === "namibia" && compact ? (
                  // Inside a place it's just the word: the map belongs to the first screen.
                  <span className="explore-underline pointer-events-none" data-tone="orange">
                    {hero.namibia.word}
                  </span>
                ) : m[1] === "namibia" ? (
                  <NamibiaWord word={hero.namibia.word} place={hero.namibia.place} coords={hero.namibia.coords} underline />
                ) : (
                  <ThingsWord words={hero.things} underline />
                )}
              </span>
              {m[2]}
            </span>
          )
        }
        if (m[1] === "hi") {
          // The one filled button: writing to me (the letter form).
          return (
            <span key={i} className="whitespace-nowrap">
              <button
                type="button"
                onClick={openLetter}
                style={name("explore-hi")}
                className={cn(
                  "explore-vt pill explore-hi align-baseline font-mono",
                  compact ? "text-sm" : "text-[0.62em]",
                  active && "opacity-45 hover:opacity-100",
                )}
              >
                <DotMark name="letter" />
                {hi}
              </button>
              {m[2]}
            </span>
          )
        }
        const s = byId[m[1] as SectionId]
        if (!s) return <Fragment key={i}>{bit}</Fragment>
        const on = active === s.id
        // Projects is the one place on a pill; the others are underlined.
        const underline = s.id !== "projects"
        return (
          <span key={i} className="whitespace-nowrap">
            <button
              type="button"
              onClick={() => onPick(s.id)}
              aria-current={on || undefined}
              aria-expanded={on}
              data-tone={s.tone}
              style={name(`explore-pill-${s.id}`)}
              className={cn(
                "explore-vt",
                underline ? "explore-underline" : cn("pill explore-plain align-baseline font-mono", compact ? "text-sm" : "text-[0.62em]"),
                active && !on && "opacity-45 hover:opacity-100",
              )}
            >
              {/* Pills carry their mark; an underlined word is just the word. */}
              {!underline && <DotMark name={s.mark} />}
              {words[s.id]}
            </button>
            {m[2]}
          </span>
        )
      })}
    </p>
  )
}

/**
 * The first screen: the name, as big as the hero always had it, and the
 * sentence under it. `echo`: the inert copy at the foot of the page
 * (components/page-loop.tsx).
 */
export function SentenceLanding({ echo = false, onPick }: { echo?: boolean; onPick?: (id: SectionId) => void }) {
  const { language } = useLanguage()
  const shelf = useShelf(NO_DATA)
  const hero = homeContent[language].hero

  return (
    <section
      data-stage=""
      className="relative flex flex-col items-center px-6 pt-14 pb-16 md:min-h-[calc(100svh-5rem)] md:justify-center md:px-12 md:py-[clamp(2rem,5svh,5rem)]"
    >
      <ParticleText
        ref={
          echo
            ? undefined
            : (handle) => {
                setHeroName(handle)
                return () => setHeroName(null)
              }
        }
        as={echo ? "h2" : "h1"}
        settled={echo}
        lines={hero.name.split(/\s+/)}
        accent="-"
        className="text-center font-serif font-normal lowercase tracking-[-0.02em] text-[min(clamp(3.25rem,1rem+10vw,12rem),19svh)] leading-[1.02]"
      />
      <div className="mt-[clamp(1.5rem,5svh,3.5rem)] max-w-3xl">
        <Sentence sections={shelf} active={null} onPick={onPick ?? (() => {})} />
      </div>
    </section>
  )
}

export function SentenceHome({ data }: { data: ExploreData }) {
  const shelf = useShelf(data)
  const state = useExploreState()
  const section = shelf.find((s) => s.id === state.section)

  if (section) {
    return (
      <Reader
        className="pt-10 md:pt-16"
        section={section}
        itemId={state.item}
        onOpenItem={state.openItem}
        onCloseItem={state.closeItem}
        onClose={state.close}
        lead={<Sentence sections={shelf} active={section.id} compact onPick={state.open} />}
        leadPhoneClassName="w-full"
      />
    )
  }

  return (
    <>
      <SentenceLanding onPick={state.open} />
      <HomeFooter />
    </>
  )
}
