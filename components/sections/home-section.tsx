"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

import { homeContent } from "@/content/home"
import { useLanguage } from "@/components/language-provider"
import { Magnetic } from "@/components/magnetic"
import { RollText } from "@/components/roll-text"
import { ScrollWords } from "@/components/scroll-words"
import { BOOT_SEQUENCE_MS, hasBootPlayed, markBootPlayed } from "@/lib/motion"
import { cn } from "@/lib/utils"

const CHAR_STAGGER_MS = 35

export function HomeSection() {
  const { language } = useLanguage()
  const t = homeContent[language].hero
  const [boot] = useState(() => !hasBootPlayed())
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    markBootPlayed()
  }, [])

  // The two name lines drift apart horizontally as the hero scrolls away.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const shift = Math.min(window.scrollY, window.innerHeight) * 0.35
      lineRefs.current.forEach((line, i) => {
        if (line) line.style.transform = `translate3d(${i % 2 ? shift : -shift}px, 0, 0)`
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const reveal = boot ? "motion-safe:animate-reveal-up" : undefined
  const delay = (ms: number) => (boot ? { animationDelay: `${ms}ms` } : undefined)

  const nameLines = t.name.split(/\s+/)
  let charIndex = 0
  let segmentIndex = 0

  // On phones each word breaks in two (after a hyphen, else at its middle),
  // so the name runs four lines deep at twice the size.
  const halves = (word: string) => {
    const cut = word.includes("-") ? word.indexOf("-") + 1 : Math.ceil(word.length / 2)
    return [word.slice(0, cut), word.slice(cut)]
  }

  return (
    <>
      <section className="relative flex min-h-[calc(100svh-5.5rem)] flex-col px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-8 overflow-hidden">
        <div className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col">
          {/* The name, set as large as the viewport allows. */}
          <h1 className="my-auto py-10 md:py-8 font-serif font-normal lowercase leading-[0.96] md:leading-[1.02] tracking-[-0.04em] text-[26vw] md:text-[clamp(3.25rem,15.2vw,17rem)]">
            {nameLines.map((line, li) => (
              <span
                key={line}
                ref={(el) => {
                  lineRefs.current[li] = el
                }}
                className={cn("block will-change-transform", li % 2 === 1 && "text-right")}
              >
                {halves(line).map((segment) => {
                  const si = segmentIndex++
                  return (
                    <span
                      key={si}
                      className={cn("block md:inline md:[text-align:inherit]", si % 2 === 1 ? "text-right" : "text-left")}
                    >
                      {[...segment].map((char) => {
                        const i = charIndex++
                        return (
                          <span key={i} className="inline-block overflow-hidden pb-[0.3em] -mb-[0.3em] align-bottom">
                            <span
                              className={cn("inline-block", boot && "motion-safe:animate-char-rise", char === "-" && "text-primary")}
                              style={boot ? { animationDelay: `${BOOT_SEQUENCE_MS.heroName + i * CHAR_STAGGER_MS}ms` } : undefined}
                            >
                              {char}
                            </span>
                          </span>
                        )
                      })}
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>

          <div
            className={cn("flex items-end justify-end gap-4 font-mono text-label uppercase tracking-[0.12em] md:tracking-[0.2em]", reveal)}
            style={delay(BOOT_SEQUENCE_MS.heroMeta)}
          >
            <Magnetic>
            <Link
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-border px-4 py-2.5 md:px-5 md:py-3 text-foreground transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <RollText>{t.cta}</RollText>
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <section id="intro" className="scroll-mt-20 px-6 md:px-12 lg:px-16 py-28 md:py-44">
        <div className="mx-auto max-w-[90rem] grid gap-10 md:grid-cols-12">
          <h2 data-reveal className="md:col-span-3 font-mono text-label uppercase tracking-[0.3em] text-muted-foreground md:pt-4">
            <span className="text-primary">001</span> / {t.introLabel}
          </h2>

          <div className="md:col-span-9 space-y-16">
            <ScrollWords
              text={t.intro}
              className="font-serif text-[clamp(1.875rem,1rem+2.8vw,4.25rem)] leading-[1.08] tracking-[-0.02em]"
            />

            <div data-reveal className="grid gap-8 md:grid-cols-9">
              <p className="md:col-span-5 md:col-start-5 border-l border-primary/60 pl-6 text-muted-foreground leading-relaxed text-lg">
                {t.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
