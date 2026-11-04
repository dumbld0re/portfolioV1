"use client"

import { useEffect, useRef, useState } from "react"

import { AsciiBackground } from "@/components/ascii-background"
import { CornerControls } from "@/components/corner-controls"
import { Header } from "@/components/header"
import { useLanguage } from "@/components/language-provider"
import { timelineContent, type TimelineYear } from "@/content/timeline"
import { inlineLink, sectionLabel } from "@/lib/styles"
import { cn } from "@/lib/utils"

import "./timeline.css"

// Timing, matched to the reference this page is modelled on.
const GLIDE_BASE = 1150 // ms for one panel
const WHEEL_THRESHOLD = 22 // summed deltaY below this is trackpad jitter
const WHEEL_COOLDOWN = 160 // ms of momentum swallowed after a move lands
const INTRO_MS = 2800

/**
 * One year per screen. Each wheel gesture, arrow key or space moves exactly one
 * year with a timed glide; the list loops (the last year flows back into the
 * first) through two clone panels that are swapped for their twins the moment
 * they land. The left column is pinned and crossfades to the active year's
 * photos and reflection. Scroll mechanic modelled on victorguo.com; the look
 * is the site's own.
 */
export function TimelinePage() {
  const { language } = useLanguage()
  const t = timelineContent[language]
  const years = t.years
  const first = years[0]
  const last = years[years.length - 1]

  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const activeRef = useRef<number | null>(null)

  useEffect(() => {
    const html = document.documentElement
    const root = rootRef.current!
    const header = headerRef.current
    html.classList.add("tl-html")
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Clones are hidden by CSS on small screens / reduced motion, so "visible" = loopable.
    const loopable = !window.matchMedia("(max-width: 1080px)").matches && !reducedMotion
    const paging = loopable

    const panels = () =>
      Array.from(root.querySelectorAll<HTMLElement>(".tl-panel")).filter((p) => p.offsetParent !== null)
    const real = Array.from(root.querySelectorAll<HTMLElement>(".tl-panel:not([data-clone])"))
    const top = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY

    const activate = (year: number) => {
      activeRef.current = year
      setActive(year)
    }

    // --- jumps and glides ---
    const hardScrollTo = (y: number) => {
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = "auto"
      window.scrollTo(0, y)
      void html.offsetHeight
      html.style.scrollBehavior = prev
    }

    let glideRAF: number | null = null
    let snapWas: string | null = null
    let behaviorWas: string | null = null
    let wheelQuietUntil = 0

    const releaseGlide = () => {
      if (snapWas !== null) html.style.scrollSnapType = snapWas
      if (behaviorWas !== null) html.style.scrollBehavior = behaviorWas
      snapWas = behaviorWas = null
    }
    const cancelGlide = () => {
      if (glideRAF) cancelAnimationFrame(glideRAF)
      glideRAF = null
      releaseGlide()
    }
    // Ease-out so the page leaves the instant the wheel moves.
    const easeOut = (k: number) => 1 - Math.pow(1 - k, 3)

    const glideTo = (y: number) => {
      const from = window.scrollY
      const delta = y - from
      if (Math.abs(delta) < 1) return
      if (reducedMotion) return hardScrollTo(y)
      const span = Math.abs(delta) / Math.max(1, window.innerHeight)
      const dur = Math.min(2600, GLIDE_BASE + 280 * Math.max(0, span - 1))
      cancelGlide()
      snapWas = html.style.scrollSnapType
      behaviorWas = html.style.scrollBehavior
      html.style.scrollSnapType = "none"
      html.style.scrollBehavior = "auto"
      let t0: number | null = null
      const step = (ts: number) => {
        if (t0 === null) t0 = ts
        const k = Math.min(1, (ts - t0) / dur)
        window.scrollTo(0, from + delta * easeOut(k))
        if (k < 1) {
          glideRAF = requestAnimationFrame(step)
          return
        }
        glideRAF = null
        releaseGlide()
        wheelQuietUntil = ts + WHEEL_COOLDOWN
      }
      glideRAF = requestAnimationFrame(step)
    }

    // A year can be on screen twice (real + clone): pick the one we're parked on.
    const currentIndex = () => {
      const y = window.scrollY
      let best = -1
      let bestGap = Infinity
      panels().forEach((p, i) => {
        if (Number(p.dataset.year) !== activeRef.current) return
        const gap = Math.abs(top(p) - y)
        if (gap < bestGap) {
          bestGap = gap
          best = i
        }
      })
      return best
    }
    const stepPanel = (dir: 1 | -1) => {
      const all = panels()
      const i = currentIndex()
      const next = i < 0 ? undefined : all[i + dir]
      if (next) glideTo(top(next))
    }

    // --- wheel: one panel per gesture ---
    // Once a gesture has moved a panel, the rest of it (trackpad momentum, a
    // wheel still spinning) is ignored until the wheel goes quiet or the
    // deltas jump up again, which means a fresh push.
    let wheelAccum = 0
    let wheelIdle: number | undefined
    let armed = true
    let lastAbs = 0
    let lastWheelTs = -Infinity
    const onWheel = (e: WheelEvent) => {
      if (!paging) {
        cancelGlide()
        return
      }
      if (e.ctrlKey) return
      e.preventDefault()
      const abs = Math.abs(e.deltaY)
      const fresh = e.timeStamp - lastWheelTs > 150 || (abs > lastAbs * 1.6 && abs > 8)
      lastAbs = abs
      lastWheelTs = e.timeStamp
      if (glideRAF || e.timeStamp < wheelQuietUntil) {
        wheelAccum = 0
        armed = false
        return
      }
      if (!armed) {
        if (!fresh) return
        armed = true
      }
      wheelAccum += e.deltaY
      window.clearTimeout(wheelIdle)
      wheelIdle = window.setTimeout(() => (wheelAccum = 0), 120)
      if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return
      const dir = wheelAccum > 0 ? 1 : -1
      wheelAccum = 0
      armed = false
      stepPanel(dir)
    }

    // --- keys: arrows, page up/down, space ---
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      const space = e.key === " "
      if (space && target && (/^(BUTTON|INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) return
      const dir =
        e.key === "ArrowDown" || e.key === "PageDown" ? 1 : e.key === "ArrowUp" || e.key === "PageUp" ? -1 : space ? (e.shiftKey ? -1 : 1) : 0
      if (!dir) return
      e.preventDefault()
      if (glideRAF) return
      stepPanel(dir)
    }

    // --- loop: when a clone lands exactly, swap to its twin ---
    let jumping = false
    const checkLoop = (y: number) => {
      if (!loopable || jumping) return
      root.querySelectorAll<HTMLElement>(".tl-panel[data-clone]").forEach((c) => {
        if (Math.abs(y - top(c)) >= 2) return
        const twin = real.find((p) => p.dataset.year === c.dataset.year)
        if (!twin) return
        jumping = true
        cancelGlide()
        hardScrollTo(top(twin))
        requestAnimationFrame(() => requestAnimationFrame(() => (jumping = false)))
      })
    }

    // --- active year ---
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && activate(Number((e.target as HTMLElement).dataset.year))),
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    )
    panels().forEach((p) => io.observe(p))

    // --- scroll chrome ---
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const start = top(real[0])
        const y = window.scrollY
        root.classList.toggle("is-scrolled", Math.abs(y - start) > 40)
        header?.classList.toggle("is-stuck", Math.abs(y - start) > 10)
        checkLoop(y)
        ticking = false
      })
    }

    // --- rail + cue clicks ---
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-goto]")
      if (!btn) return
      const target = real.find((p) => p.dataset.year === btn.dataset.goto)
      if (target) glideTo(top(target))
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", cancelGlide, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("keydown", onKey)
    root.addEventListener("click", onClick)

    // --- boot: start on the first real year, then reveal after a paint ---
    root.classList.add("is-intro")
    if (loopable) hardScrollTo(top(real[0]))
    onScroll()
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => activate(Number(real[0].dataset.year)))
    })
    const introTimer = window.setTimeout(() => root.classList.remove("is-intro"), INTRO_MS)
    const onLoad = () => loopable && hardScrollTo(top(real[0]))
    window.addEventListener("load", onLoad)

    return () => {
      cancelGlide()
      io.disconnect()
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.clearTimeout(introTimer)
      window.clearTimeout(wheelIdle)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", cancelGlide)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("load", onLoad)
      document.removeEventListener("keydown", onKey)
      root.removeEventListener("click", onClick)
      html.classList.remove("tl-html")
    }
  }, [language])

  const nextYear = years[1]?.year

  return (
    <div ref={rootRef} className="tl relative min-h-screen bg-background text-foreground">
      <AsciiBackground className="fixed" />

      {/* The site's own nav, pinned so it stays put while the years page. */}
      <div ref={headerRef} className="tl-header fixed inset-x-0 top-0 z-40 bg-background/80 backdrop-blur-md">
        <Header />
      </div>

      <nav className="tl-rail" aria-label={t.jumpTo}>
        {years.map((y) => (
          <button key={y.year} type="button" data-goto={y.year} className={cn("tl-rail-item", active === y.year && "is-active")}>
            {y.year}
          </button>
        ))}
      </nav>

      <main className="tl-stage relative z-10">
        {/* Left, pinned: the active year's photos and a look back. */}
        <div className="tl-viz">
          <div className="tl-viz-frame">
            {years.map((y) => (
              <figure key={y.year} className={cn("tl-shot", active === y.year && "is-active")} aria-hidden={active !== y.year}>
                <div className="tl-collage" data-count={Math.min(3, y.photos.length)}>
                  {y.photos.slice(0, 3).map((p) => (
                    <div key={p.src} className="tl-photo">
                      {/* eslint-disable-next-line @next/next/no-img-element -- placeholder photos */}
                      <img src={p.src} alt={p.caption} loading="eager" />
                      <span>{p.caption}</span>
                    </div>
                  ))}
                </div>
                <figcaption>
                  <p className={sectionLabel}>{t.reflection}</p>
                  <p className="mt-3 max-w-prose font-serif text-lg leading-relaxed text-foreground/85">{y.reflection}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Right: one year per screen. */}
        <div className="tl-text">
          {years.length > 1 && <Panel year={last} active={active === last.year} clone />}
          {years.map((y) => (
            <Panel key={y.year} year={y} active={active === y.year} />
          ))}
          {years.length > 1 && <Panel year={first} active={active === first.year} clone />}
        </div>
      </main>

      {nextYear && (
        <button type="button" className="tl-cue" data-goto={nextYear} aria-label={`${t.jumpTo} ${nextYear}`}>
          <span aria-hidden="true" className="tl-cue-arrow">↓</span>
          {nextYear}
        </button>
      )}

      <CornerControls />
    </div>
  )
}

function Panel({ year: y, active, clone }: { year: TimelineYear; active: boolean; clone?: boolean }) {
  return (
    <section
      className={cn("tl-panel", active && "is-active")}
      data-year={y.year}
      data-clone={clone ? "" : undefined}
      aria-hidden={clone || undefined}
    >
      <div className="tl-panel-inner">
        <h2 className="font-serif text-7xl leading-none tracking-[-0.03em] md:text-8xl">{y.year}</h2>
        <p className="mt-5 font-serif text-xl italic text-foreground/85 md:text-2xl">{y.summary}</p>
        <ul className="tl-items">
          {y.entries.map((e) => (
            <li key={e.title} className="tl-item">
              <p className="text-lg">
                {e.title}
                {e.org && (
                  <>
                    {" @ "}
                    {e.orgHref ? (
                      <a
                        href={e.orgHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={clone ? -1 : undefined}
                        className={inlineLink}
                      >
                        {e.org}
                      </a>
                    ) : (
                      e.org
                    )}
                  </>
                )}
              </p>
              {e.note && <p className="mt-1 border-l border-border pl-4 text-muted-foreground">{e.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
