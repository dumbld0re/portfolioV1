"use client"

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"

import { DotMark } from "@/components/dot-mark"
import { AFRICA, NAMIBIA } from "@/content/namibia-map"
import { motionOff } from "@/lib/eggs"

// "namibia" in the hero: pointed at, focused or tapped, a card opens above it
// with Africa drawn in dots and Namibia lit, plus Namibia on its own, larger.
// The dots fly out of the word into the map, and back in when it closes.

const CARD_W = 300
const PAD = 12
const MAP_W = CARD_W - PAD * 2
const MAP_H = 196
const SMALL = 4 // px between dots, all of Africa
const BIG = 3.3 // px between dots, Namibia alone
const FLY_MS = 760
const BACK_MS = 280

type Dot = { x: number; y: number; hot: boolean; delay: number }

/** Every dot's home in the card's canvas, Africa left, Namibia large on the right. */
function layout() {
  const dots: Dot[] = []
  const ax = 2
  const ay = (MAP_H - AFRICA.length * SMALL) / 2
  let nMinX = Infinity, nMaxX = -Infinity, nMinY = Infinity, nMaxY = -Infinity
  AFRICA.forEach((row, r) =>
    [...row].forEach((c, k) => {
      if (c === ".") return
      const x = ax + k * SMALL
      const y = ay + r * SMALL
      if (c === "n") {
        nMinX = Math.min(nMinX, x); nMaxX = Math.max(nMaxX, x); nMinY = Math.min(nMinY, y); nMaxY = Math.max(nMaxY, y)
      }
      dots.push({ x, y, hot: c === "n", delay: 0 })
    }),
  )
  const bw = NAMIBIA[0].length * BIG
  const bh = NAMIBIA.length * BIG
  const bx = MAP_W - bw - 4
  const by = MAP_H - bh - 14
  NAMIBIA.forEach((row, r) =>
    [...row].forEach((c, k) => {
      if (c === "n") dots.push({ x: bx + k * BIG, y: by + r * BIG, hot: true, delay: 0 })
    }),
  )
  // The wedge from Namibia on the map to the large one.
  const wedge = [
    [nMaxX, nMinY],
    [bx, by],
    [bx, by + bh],
    [nMaxX, nMaxY],
  ] as const
  return { dots, wedge }
}

export function NamibiaWord({ word, place, coords }: { word: string; place: string; coords: string }) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false) // mounted, including while flying back
  // Where the card sits on the screen (it is drawn on top of everything, so
  // the name's dots never cover it), and where its arrow points.
  const [pos, setPos] = useState({ left: 0, bottom: 0, arrow: CARD_W / 2 })
  const [time, setTime] = useState("")
  const anchor = useRef<HTMLSpanElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const anim = useRef({ raf: 0, t0: 0, back: false })

  // Opening mounts the card; closing lets the dots fly home first.
  const show = (next: boolean) => {
    setOpen(next)
    if (next) setShown(true)
  }

  // Above the word, kept on the screen near an edge; the arrow stays on the word.
  useLayoutEffect(() => {
    if (!shown || !anchor.current) return
    const r = anchor.current.getBoundingClientRect()
    const mid = r.left + r.width / 2
    const left = Math.max(12, Math.min(document.documentElement.clientWidth - CARD_W - 12, mid - CARD_W / 2))
    setPos({ left, bottom: window.innerHeight - r.top + 12, arrow: mid - left })
    setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Windhoek", hour: "2-digit", minute: "2-digit" }).format(new Date()))
  }, [shown])

  useEffect(() => {
    const c = canvas.current
    if (!shown || !c) return
    const ctx = c.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = Math.round(MAP_W * dpr)
    c.height = Math.round(MAP_H * dpr)
    const { dots, wedge } = layout()
    dots.forEach((d) => (d.delay = Math.random() * 260 + (d.hot ? 120 : 0)))
    const cs = getComputedStyle(c)
    const land = cs.getPropertyValue("--map-land").trim() || "#b5b5b5"
    const hot = cs.getPropertyValue("--map-hot").trim() || "#f2542d"
    // Where the dots come from: the word, just below the card's arrow.
    const fromX = pos.arrow - PAD
    const fromY = MAP_H + 52
    const still = motionOff()
    const a = anim.current
    a.back = !open
    a.t0 = performance.now()
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)

    const frame = (now: number) => {
      const el = now - a.t0
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, MAP_W, MAP_H)
      // the wedge fades in once the dots have landed
      const settled = still ? 1 : a.back ? Math.max(0, 1 - el / 120) : Math.min(1, Math.max(0, (el - FLY_MS * 0.7) / 300))
      if (settled > 0) {
        const g = ctx.createLinearGradient(wedge[0][0], 0, wedge[1][0], 0)
        g.addColorStop(0, hot)
        g.addColorStop(1, "transparent")
        ctx.globalAlpha = 0.22 * settled
        ctx.fillStyle = g
        ctx.beginPath()
        wedge.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      }
      let busy = false
      for (const pass of [false, true]) {
        ctx.fillStyle = pass ? hot : land
        ctx.beginPath()
        for (const d of dots) {
          if (d.hot !== pass) continue
          let p = 1
          if (!still) {
            p = a.back ? 1 - Math.min(1, el / BACK_MS) : ease(Math.min(1, Math.max(0, (el - d.delay) / (FLY_MS - 260))))
            if ((a.back && p > 0) || (!a.back && p < 1)) busy = true
          }
          if (p <= 0) continue
          const x = fromX + (d.x - fromX) * p
          const y = fromY + (d.y - fromY) * p
          const r = (d.hot ? 1.25 : 1.1) * (0.5 + 0.5 * p)
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, Math.PI * 2)
        }
        ctx.fill()
      }
      if (busy) a.raf = requestAnimationFrame(frame)
      else if (a.back) setShown(false)
    }
    cancelAnimationFrame(a.raf)
    a.raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(a.raf)
  }, [shown, open, pos])

  // Escape closes it; so does a tap anywhere else, or scrolling away.
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    const onDown = (e: PointerEvent) => {
      if (!anchor.current?.contains(e.target as Node)) close()
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("scroll", close, { passive: true })
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("scroll", close)
    }
  }, [open])

  return (
    <span ref={anchor} className="relative inline">
      <button
        type="button"
        className="pill"
        data-tone="coral"
        aria-expanded={open}
        aria-controls="namibia-card"
        onPointerEnter={(e) => e.pointerType === "mouse" && show(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        onFocus={() => show(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          // A mouse already opened it on the way in; a tap toggles it.
          if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") show(!open)
        }}
      >
        <DotMark name="pin" />
        {word}
      </button>
      {shown &&
        createPortal(
          <span
            id="namibia-card"
            role="tooltip"
            className="namibia-card"
            style={{ left: pos.left, bottom: pos.bottom, "--arrow": `${pos.arrow}px` } as CSSProperties}
          >
            <span className="mb-2 flex items-baseline justify-between gap-3 font-mono text-xs">
              <span className="text-foreground">{place}</span>
              <span className="tabular-nums text-muted-foreground">{time}</span>
            </span>
            <canvas ref={canvas} aria-hidden="true" style={{ width: MAP_W, height: MAP_H, display: "block" }} />
            <span className="mt-1 block font-mono text-xs tabular-nums text-muted-foreground">{coords}</span>
          </span>,
          document.body,
        )}
    </span>
  )
}
