"use client"

import { createContext, Fragment, useContext, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react"

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

// How much is behind each place, for the small raised number after its word
// (posts ¹⁴): a number says there's a collection behind it, which is what
// makes the sentence read as the way in. Posts and the library are counted on
// the server (app/[lang]/page.tsx), so the first screen and the loop's echo
// have them too; the rest count their own items. "me" carries none.
type Counts = Partial<Record<SectionId, number>>
const CountsContext = createContext<Counts>({})

export function SentenceCounts({ counts, children }: { counts: Counts; children: ReactNode }) {
  return <CountsContext value={counts}>{children}</CountsContext>
}

/** The places' underlines draw in one by one, once, on a first visit. */
const INTRO_KEY = "sentence-intro-seen"
const INTRO_ATTR = "data-sentence-intro"

function useFirstVisitIntro(on: boolean) {
  useLayoutEffect(() => {
    if (!on) return
    const root = document.documentElement
    if (root.hasAttribute(INTRO_ATTR)) return
    try {
      if (localStorage.getItem(INTRO_KEY)) return
      localStorage.setItem(INTRO_KEY, "1")
    } catch {
      return
    }
    root.setAttribute(INTRO_ATTR, "")
    // Not cleared on unmount: the Suspense fallback hands over to the real
    // page mid-way, and the sequence should carry on through that.
    window.setTimeout(() => root.removeAttribute(INTRO_ATTR), 6000)
  }, [on])
}

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
  const counts = useContext(CountsContext)
  let place = 0

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
                  // A toy, not a place: a dotted line, so a solid one only ever means "go in".
                  "explore-vt explore-toy inline-block transition-opacity",
                  active && (m[1] === "namibia" ? "opacity-45" : "opacity-45 hover:opacity-100"),
                )}
              >
                {m[1] === "namibia" && compact ? (
                  // Inside a place it's just the word: the map belongs to the first screen.
                  <span className="explore-underline pointer-events-none" data-tone="orange">
                    {hero.namibia.word}
                  </span>
                ) : m[1] === "namibia" ? (
                  <NamibiaWord
                    word={hero.namibia.word}
                    place={hero.namibia.place}
                    coords={hero.namibia.coords}
                    underline
                  />
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
        // Only on the first screen: inside a place the list itself is open beside it.
        const count = compact || s.id === "about" ? 0 : (counts[s.id] ?? s.items.length)
        const order = place++
        return (
          <span key={i} className="whitespace-nowrap">
            <button
              type="button"
              onClick={() => onPick(s.id)}
              aria-current={on || undefined}
              aria-expanded={on}
              data-tone={s.tone}
              style={{
                ...name(`explore-pill-${s.id}`),
                ["--i" as string]: order,
              }}
              className={cn(
                "explore-vt",
                underline
                  ? "explore-link"
                  : cn("pill explore-plain align-baseline font-mono", compact ? "text-sm" : "text-[0.62em]"),
                active && !on && "opacity-45 hover:opacity-100",
              )}
            >
              {/* Pills carry their mark; an underlined word is just the word. */}
              {!underline && <DotMark name={s.mark} />}
              {words[s.id]}
              {count > 0 && <span className="sr-only"> ({count})</span>}
            </button>
            {/* After the comma, like a footnote mark, so the word keeps its punctuation. */}
            {m[2]}
            {count > 0 && (
              <sup aria-hidden className="explore-count" style={{ ["--i" as string]: order }}>
                {count}
              </sup>
            )}
          </span>
        )
      })}
    </p>
  )
}

/**
 * A small note saying the sentence is the way in, drawn like the one by the
 * languages (components/home-bar.tsx): beside the sentence where there's
 * room, with an arrow curling back to it; under it, pointing up, where there
 * isn't.
 */
function SentenceNote({ text }: { text: string }) {
  // The sentence's box is wider than its balanced lines, so the side note
  // sits where the longest line actually ends, not at the box's edge.
  const side = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const note = side.current
    const box = note?.parentElement?.parentElement
    const p = box?.querySelector("p")
    if (!note || !box || !p) return
    const place = () => {
      const range = document.createRange()
      range.selectNodeContents(p)
      const right = Math.max(...Array.from(range.getClientRects(), (r) => r.right))
      note.style.left = `${right - box.getBoundingClientRect().left + 12}px`
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(box)
    document.fonts?.ready.then(place)
    return () => ro.disconnect()
  }, [text])

  return (
    <span
      aria-hidden="true"
      className="explore-note pointer-events-none block font-mono text-xs text-muted-foreground md:text-[13px]"
    >
      <span ref={side} className="absolute top-1/2 left-full hidden w-52 -translate-y-1/2 items-center xl:flex">
        {/* Out of the note, one loose loop, then flat into the sentence. */}
        <svg
          viewBox="0 0 64 40"
          className="mr-2 h-10 w-16 shrink-0 overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M64 22C56 28 46 28 42 22C38 16 44 11 48 16C52 22 42 30 30 28C20 26 10 22 2 20" />
          <path d="M7 24.9 2 20l6.7-1.9" />
        </svg>
        <span className="text-balance">{text}</span>
      </span>
      <span className="mt-6 flex items-end justify-center xl:hidden">
        <svg
          viewBox="0 0 40 34"
          className="mr-1 h-[30px] w-9 shrink-0 -scale-x-100 overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 28c14 3 26-4 30-24" />
          <path d="M26.5 9 32 3.5l4.5 6.5" />
        </svg>
        <span className="-mb-1">{text}</span>
      </span>
    </span>
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
  useFirstVisitIntro(!echo)

  return (
    <section
      data-stage=""
      data-intro={echo ? undefined : ""}
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
      <div className="relative mt-[clamp(1.5rem,5svh,3.5rem)] max-w-3xl">
        <Sentence sections={shelf} active={null} onPick={onPick ?? (() => {})} />
        <SentenceNote text={exploreContent[language].sentenceNote} />
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
