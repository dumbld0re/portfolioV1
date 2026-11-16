"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import { useLanguageOrDefault } from "@/components/language-provider"
import { globeContent } from "@/content/globe"
import { LOCALE, type Language } from "@/lib/i18n"
import { motionOff, watchMotion } from "@/lib/eggs"
import { lockScroll } from "@/lib/scroll"
import { sectionLabel } from "@/lib/styles"
import { useMediaQuery } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"
import { BANDS, SEED, bandOf } from "@/lib/visitors"

import type { GlobeEngine, GlobeMode, Pick } from "./engine"

// Where the visitors come from, on a ball of dots you can spin: the full
// globe opens in a dialog (from the eye count, or the footer on phones),
// and on phones the top of it rises out of the bottom of the footer.

type Visitors = { countries: Record<string, number>; you: string | null }

let request: Promise<Visitors | null> | null = null
function fetchVisitors() {
  request ??= fetch("/api/visitors")
    .then((res) => (res.ok ? (res.json() as Promise<Visitors>) : null))
    .catch(() => null)
  return request
}

export function useVisitors() {
  const [data, setData] = useState<Visitors | null>(null)
  // The country list steps aside once the globe is zoomed in far enough to
  // run under it.
  const [listClear, setListClear] = useState(true)
  const onEdge = (right: number) => setListClear(right < window.innerWidth - 48 - 224 - 32)
  useEffect(() => {
    let live = true
    fetchVisitors().then((d) => live && setData(d))
    return () => {
      live = false
    }
  }, [])
  return data
}

export function visitorTotals(data: Visitors | null) {
  if (!data) return null
  const values = Object.values(data.countries)
  return { people: values.reduce((a, b) => a + b, 0), countries: values.filter(Boolean).length }
}

const OPEN_EVENT = "globe:open"
export function openGlobe() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

const number = (n: number, language: Language) => n.toLocaleString(language === "en" ? "en-US" : LOCALE[language])

function countryName(code: string, language: Language) {
  try {
    return (new Intl.DisplayNames([LOCALE[language]], { type: "region" }).of(code) ?? code).toLowerCase()
  } catch {
    return code
  }
}

/** The canvas and its engine. Without WebGL it stays empty. */
function GlobeCanvas({
  mode,
  data,
  className,
  onTap,
  onPick,
  onEdge,
  engineRef,
  children,
  label,
}: {
  mode: GlobeMode
  data: Visitors
  className?: string
  onTap?: () => void
  onPick?: (p: Pick) => void
  onEdge?: (right: number) => void
  engineRef?: React.RefObject<GlobeEngine | null>
  children?: ReactNode
  /** What the full globe shows, for screen readers. */
  label?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const engine = useRef<GlobeEngine | null>(null)
  const callbacks = useRef({ onTap, onPick, onEdge })
  useEffect(() => {
    callbacks.current = { onTap, onPick, onEdge }
  })

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    let dead = false
    const stops: (() => void)[] = []
    // The engine and the map data load with the globe, not with the page.
    import("./engine").then(({ GlobeEngine }) => {
      if (dead) return
      let e: GlobeEngine
      try {
        e = new GlobeEngine(el, {
          mode,
          countries: data.countries,
          you: data.you,
          still: motionOff(),
          onTap: () => callbacks.current.onTap?.(),
          onPick: (p) => callbacks.current.onPick?.(p),
          onEdge: (r) => callbacks.current.onEdge?.(r),
        })
      } catch {
        return
      }
      engine.current = e
      if (engineRef) engineRef.current = e
      el.dataset.ready = ""
      const ro = new ResizeObserver(() => e.resize())
      ro.observe(el)
      // Colours follow the theme.
      let dark = document.documentElement.classList.contains("dark")
      const mo = new MutationObserver(() => {
        const now = document.documentElement.classList.contains("dark")
        if (now !== dark) e.build()
        dark = now
      })
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
      stops.push(() => ro.disconnect(), () => mo.disconnect(), watchMotion(() => e.setStill(motionOff())), () => e.destroy())
    })
    return () => {
      dead = true
      stops.forEach((f) => f())
      engine.current = null
      if (engineRef) engineRef.current = null
    }
    // The engine is built once; new numbers go through update() below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    engine.current?.update(data.countries, data.you)
  }, [data])

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvas}
        role={mode === "full" ? "img" : undefined}
        aria-label={mode === "full" ? label : undefined}
        aria-hidden={mode === "horizon" || undefined}
        className={cn(
          "globe-canvas absolute inset-0 size-full opacity-0 transition-opacity duration-700 data-[ready]:opacity-100",
          mode === "horizon" ? "touch-pan-y" : "touch-none cursor-grab active:cursor-grabbing",
        )}
      />
      {children}
    </div>
  )
}

/** Small dots in the band colours, overlapping like a row of avatars. */
export function BandStack({ data, className }: { data: Visitors; className?: string }) {
  const bands = useMemo(() => {
    const seen = new Set(Object.values(data.countries).filter(Boolean).map(bandOf))
    return [...seen].sort((a, b) => b - a).slice(0, 4)
  }, [data])
  return (
    <span aria-hidden="true" className={cn("inline-flex items-center", className)}>
      {bands.map((b, i) => (
        <span
          key={b}
          className={cn("size-3.5 rounded-full ring-2 ring-background", i > 0 && "-ml-1.5")}
          style={{ background: BANDS[b].color }}
        />
      ))}
    </span>
  )
}

/** The legend: one dot per colour band and what it means. */
function Legend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground", className)}>
      {BANDS.map((b) => (
        <li key={b.label} className="inline-flex items-center gap-1.5 tabular-nums">
          <span className="size-2 rounded-full" style={{ background: b.color }} />
          {b.label}
        </li>
      ))}
    </ul>
  )
}

/** The whole globe in a dialog, mounted once in the layout and opened from anywhere. */
export function GlobeDialog() {
  const language = useLanguageOrDefault()
  const t = globeContent[language]
  const ref = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [pick, setPick] = useState<Pick>(null)
  const engine = useRef<GlobeEngine | null>(null)
  const [data, setData] = useState<Visitors | null>(null)
  // The country list steps aside once the globe is zoomed in far enough to
  // run under it.
  const [listClear, setListClear] = useState(true)
  const onEdge = (right: number) => setListClear(right < window.innerWidth - 48 - 224 - 32)

  useEffect(() => {
    const show = () => {
      const dialog = ref.current
      if (!dialog || dialog.open) return
      // Fresh numbers each time it opens.
      request = null
      // A failed fetch still opens on the analytics numbers.
      fetchVisitors().then((d) => setData(d ?? { countries: SEED, you: null }))
      dialog.showModal()
      lockScroll(true)
      setOpen(true)
      window.dispatchEvent(new Event("cursor:raise"))
    }
    window.addEventListener(OPEN_EVENT, show)
    return () => window.removeEventListener(OPEN_EVENT, show)
  }, [])

  const close = () => ref.current?.close()
  const totals = visitorTotals(data)
  const ranked = useMemo(
    () => (data ? Object.entries(data.countries).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]) : []),
    [data],
  )

  return (
    <dialog
      ref={ref}
      aria-label={t.title}
      onClose={() => {
        lockScroll(false)
        setOpen(false)
        setPick(null)
      }}
      className="globe-dialog fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-background/95 p-0 text-foreground backdrop-blur-md backdrop:bg-transparent"
    >
      {open && data && (
        <div className="relative flex h-full flex-col">
          {/* The globe fills the whole dialog, so zoomed in it runs off the
              edges of the screen rather than being cut along a line; the
              text floats over it and only its own parts catch the pointer. */}
          <GlobeCanvas mode="full" data={data} engineRef={engine} onPick={setPick} onEdge={onEdge} label={totals ? `${t.title}: ${t.summary(number(totals.people, language), totals.countries)}` : t.title} className="absolute inset-0" />

          <header className="pointer-events-none relative z-10 flex items-start justify-between gap-6 px-6 pt-6 md:px-12 md:pt-10 [&>*]:pointer-events-auto">
            <div>
              <h2 className={sectionLabel}>{t.title}</h2>
              {totals && (
                <p className="mt-3 font-mono text-sm text-foreground tabular-nums">
                  {t.summary(number(totals.people, language), totals.countries)}
                </p>
              )}
              <p className="mt-1 font-mono text-xs text-muted-foreground">{t.since}</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="-m-3 cursor-pointer p-3 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.close} <span aria-hidden="true">✕</span>
            </button>
          </header>

          <div className="flex-1" />

          {/* Wide screens: every country, most visitors first; a click turns the globe to it. */}
          {/* Scrolls without a scrollbar; the bottom fades out instead. */}
          <ol
            data-lenis-prevent
            inert={!listClear}
            className={cn("absolute top-1/2 right-12 z-10 hidden max-h-[60vh] w-56 -translate-y-1/2 space-y-1 overflow-y-auto pb-8 font-mono text-xs transition-opacity duration-300 [mask-image:linear-gradient(to_bottom,black_85%,transparent)] [scrollbar-width:none] lg:block [&::-webkit-scrollbar]:hidden", !listClear && "pointer-events-none opacity-0")}
          >
            {ranked.map(([code, n]) => (
              <li key={code}>
                <button
                  type="button"
                  onClick={() => {
                    engine.current?.focus(code)
                    setPick({ code, count: n, x: 0, y: 0 })
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 py-0.5 text-left transition-colors hover:text-foreground",
                    pick?.code === code ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className="size-2 shrink-0 rounded-full" style={{ background: BANDS[bandOf(n)].color }} />
                  <span className="truncate">{countryName(code, language)}</span>
                  <span className="ml-auto tabular-nums">{number(n, language)}</span>
                </button>
              </li>
            ))}
          </ol>

          <footer className="pointer-events-none relative z-10 flex flex-col [&>*]:pointer-events-auto items-center gap-4 px-6 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center md:pb-10">
            <p aria-live="polite" className="min-h-10 font-mono text-sm [@media(max-height:500px)]:min-h-0">
              {pick ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: pick.count ? BANDS[bandOf(pick.count)].color : "var(--map-land)" }}
                  />
                  {countryName(pick.code, language)}
                  {data.you === pick.code && <span className="text-muted-foreground">({t.you})</span>}
                  <span className="text-muted-foreground tabular-nums">
                    {pick.count ? t.visitors(pick.count) : t.none}
                  </span>
                </span>
              ) : (
                <span className="inline-block py-2 text-xs text-muted-foreground [@media(max-height:500px)]:hidden">{t.hint}</span>
              )}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Legend />
              {data.you && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-foreground" />
                  {t.you}
                </span>
              )}
              <span className="hidden items-center gap-1 md:inline-flex">
                {[
                  ["−", 1 / 1.3],
                  ["+", 1.3],
                ].map(([label, f]) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label === "+" ? "zoom in" : "zoom out"}
                    onClick={() => engine.current?.zoomBy(f as number)}
                    className="grid size-7 cursor-pointer place-items-center rounded-full border border-border font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </button>
                ))}
              </span>
            </div>
          </footer>
        </div>
      )}
    </dialog>
  )
}

/**
 * Phones and tablets: the top of a big globe rising out of the bottom of the
 * page, turning slowly (a sideways drag spins it). Over it a pill with where
 * people came from, which opens the whole globe, and whatever controls the
 * footer hands in (`children`).
 */
export function GlobeHorizon({
  className,
  children,
  screens = "narrow",
}: {
  className?: string
  children?: ReactNode
  /** Which screens this one runs on: the phone footer's, or the wide one under the footer row. */
  screens?: "narrow" | "wide"
}) {
  const language = useLanguageOrDefault()
  const t = globeContent[language]
  const data = useVisitors()
  const totals = visitorTotals(data)
  // Each copy only runs on the screens it is shown on.
  const wide = useMediaQuery("(min-width: 64rem)")
  const shown = screens === "wide" ? wide : !wide

  return (
    <div className={cn("globe-horizon relative -mx-6 h-[calc(16rem+env(safe-area-inset-bottom))] self-stretch overflow-hidden md:-mx-12", className)}>
      {data && shown && <GlobeCanvas mode="horizon" data={data} onTap={openGlobe} className="absolute inset-0" />}
      {/* The page's background fades in over the far edge, so the ball
          comes up out of the page rather than being cut off by it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background to-transparent" />
      {data && totals && (
        <button
          type="button"
          onClick={openGlobe}
          aria-label={t.open}
          className="absolute top-[34%] left-1/2 inline-flex -translate-x-1/2 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-border/70 bg-background/75 px-5 py-3 font-mono text-sm text-muted-foreground shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md transition-colors hover:text-foreground"
        >
          {t.pill(totals.countries).split(String(totals.countries))[0]}
          <BandStack data={data} />
          <span className="text-foreground tabular-nums">{totals.countries}</span>
          {t.pill(totals.countries).split(String(totals.countries))[1]?.trim()}
        </button>
      )}
      {children}
    </div>
  )
}
