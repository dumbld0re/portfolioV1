"use client"

import { useEffect, useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom"

// --- feel ------------------------------------------------------------------
// Where the string ties onto the card's top edge, as a share of its width.
const ATTACH_X = 0.62
/** Rope points. More = smoother, floppier string. */
const SEGMENTS = 18
const ROPE_GRAVITY = 0.45
const ROPE_DAMPING = 0.975
const ITERATIONS = 14
/** The card: pulled gently toward where it wants to hang, heavy on the rope. */
const BOX_GRAVITY = 0.35
const BOX_PULL = 0.03
const BOX_DAMPING = 0.9
/** Share of a rope correction the card takes (the rope points take 1). */
const BOX_GIVE = 0.12
/** The card's swing about its knot. */
const SWING_SPRING = 0.045
const SWING_DAMPING = 0.9
const SWING_DRIVE = 0.9
const MAX_TILT = 16
// How far below its title the card wants to hang, and its margin from the
// viewport edges.
const DROP = 110
const EDGE = 24
// The snap: the string lets go and whips back, then flies out and ties on.
const SNAP_MS = 300
const FLY_MS = 320
const LEAVE_MS = 420

const easeOutBack = (t: number) => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2

type Point = { x: number; y: number }
type Particle = Point & { px: number; py: number }

const noop = () => () => {}

// Hover a project and its card swings in beside it, hanging on a string tied
// to a ring after the title. The string is a chain of points under gravity;
// the card hangs off its end, so scrolling, the cursor and every change of
// project set everything swinging. Moving to another project the string
// snaps: it whips back toward the card and dangles, then flies out to the new
// title and ties on with a twang, and only then does the card switch
// (onConnect). Leaving the list snaps the string and the card drops away.
export function ProjectString({
  hovered,
  anchors,
  lane,
  onConnect,
  children,
}: {
  /** The project under the pointer or focus, or null. */
  hovered: number | null
  /** The ring spot after each title. */
  anchors: RefObject<(HTMLElement | null)[]>
  /** The empty column the card hangs in. */
  lane: RefObject<HTMLElement | null>
  onConnect: (index: number) => void
  children: ReactNode
}) {
  const mounted = useSyncExternalStore(noop, () => true, () => false)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const knotRef = useRef<SVGCircleElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const target = useRef(hovered)
  const onConnectRef = useRef(onConnect)

  useEffect(() => {
    target.current = hovered
    onConnectRef.current = onConnect
  })

  useEffect(() => {
    const svg = svgRef.current
    const path = pathRef.current
    const ring = ringRef.current
    const knot = knotRef.current
    const cardEl = cardRef.current
    const laneEl = lane.current
    if (!mounted || !svg || !path || !ring || !knot || !cardEl || !laneEl) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    // With motion turned off (the site's "pause animation" toggle or the OS
    // setting) there is no string at all, just a quiet card in the corner.
    const still = () => reduced.matches || document.documentElement.classList.contains("paused")

    // idle: hidden. fly: the loose end is flying to a ring. tied: hanging.
    // snap: let go, whipping back. leave: let go for good, card dropping.
    let phase: "idle" | "fly" | "tied" | "snap" | "leave" = "idle"
    let phaseStart = 0
    let heading: number | null = null
    let tied: number | null = null
    let flyFrom: Point = { x: 0, y: 0 }

    const rope: Particle[] = Array.from({ length: SEGMENTS }, () => ({ x: 0, y: 0, px: 0, py: 0 }))
    const box: Particle = { x: 0, y: 0, px: 0, py: 0 }
    let length = 0
    let tilt = 0
    let spin = 0
    let lastVx = 0
    const pointer: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let last = 0
    let frame = 0
    let running = false

    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const centre = (index: number | null): Point | null => {
      const el = index === null ? null : anchors.current[index]
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }

    const show = (visible: boolean) => {
      cardEl.style.opacity = visible ? "1" : "0"
      svg.style.opacity = visible ? "1" : "0"
    }

    const place = (p: Particle, x: number, y: number) => {
      p.x = p.px = x
      p.y = p.py = y
    }

    // Where the card would like to hang for this ring.
    const restFor = (ringAt: Point, w: number, h: number): Point => {
      const laneBox = laneEl.getBoundingClientRect()
      const centreX = laneBox.left + laneBox.width / 2
      return {
        // The card's left edge lines up with the free column, so it never
        // swings in over the project text.
        x: laneBox.left + w * ATTACH_X + 8 + (pointer.x - centreX) * 0.06,
        y: Math.min(
          window.innerHeight - h - EDGE,
          Math.max(EDGE, ringAt.y + DROP + (pointer.y - ringAt.y) * 0.15),
        ),
      }
    }

    const snap = (next: "snap" | "leave", now: number) => {
      phase = next
      phaseStart = now
      tied = null
      if (next === "leave") show(false)
      // The loose end whips back toward the card…
      const end = rope[0]
      end.px = end.x - (box.x - end.x) * 0.12
      end.py = end.y - (box.y - end.y) * 0.12 + 6
      // …and the card lurches away from where it was held.
      const dx = box.x - end.x
      const dy = box.y - end.y
      const d = Math.hypot(dx, dy) || 1
      box.px -= (dx / d) * 3
      box.py -= (dy / d) * 2
    }

    const step = (now: number, w: number, h: number) => {
      const wanted = target.current
      const knotOffset = w * ATTACH_X

      // --- what the string is doing ---------------------------------------
      if (phase === "idle") {
        if (wanted === null) return false
        // Fresh hover: the card drops in beside the title, already showing
        // this project, and the string flies out to tie on.
        const ringAt = centre(wanted)
        if (!ringAt) return false
        heading = wanted
        onConnectRef.current(wanted)
        const rest = restFor(ringAt, w, h)
        place(box, rest.x, rest.y - 50)
        box.px = box.x - (rest.x > ringAt.x ? 3 : -3)
        rope.forEach((p) => place(p, box.x, box.y))
        length = 20
        tilt = -6
        spin = 0
        flyFrom = { x: box.x, y: box.y }
        phase = "fly"
        phaseStart = now
        show(true)
      } else if (phase === "tied" && wanted !== tied) {
        snap(wanted === null ? "leave" : "snap", now)
      } else if (phase === "fly" && wanted !== heading) {
        snap(wanted === null ? "leave" : "snap", now)
      } else if (phase === "snap" && wanted === null) {
        phase = "leave"
        phaseStart = now
        show(false)
      } else if (phase === "leave" && wanted !== null) {
        // Came back before it was gone: catch it and fly out again.
        phase = "snap"
        phaseStart = now - SNAP_MS / 2
        show(true)
      }

      const elapsed = now - phaseStart
      if (phase === "snap" && elapsed >= SNAP_MS) {
        heading = wanted
        flyFrom = { x: rope[0].x, y: rope[0].y }
        phase = "fly"
        phaseStart = now
      }
      if (phase === "leave" && elapsed >= LEAVE_MS) {
        phase = "idle"
        return false
      }

      const current = phase === "tied" ? tied : phase === "fly" ? heading : wanted
      const ringAt = centre(current)
      const rest = ringAt ? restFor(ringAt, w, h) : { x: box.x, y: box.y }
      const knotRest = { x: rest.x, y: rest.y }
      const wantLength = ringAt ? Math.hypot(knotRest.x - ringAt.x, knotRest.y - ringAt.y) * 1.08 + 12 : 40

      // --- the card -------------------------------------------------------
      const vx = (box.x - box.px) * BOX_DAMPING
      const vy = (box.y - box.py) * BOX_DAMPING
      box.px = box.x
      box.py = box.y
      if (phase === "leave") {
        // Let go: it just falls away as it fades.
        box.x += vx
        box.y += vy + BOX_GRAVITY * 2
      } else {
        box.x += vx + (knotRest.x - box.x) * BOX_PULL
        box.y += vy + BOX_GRAVITY + (knotRest.y - box.y) * BOX_PULL
      }

      // --- the rope -------------------------------------------------------
      if (phase === "tied") length += (wantLength - length) * 0.08
      else if (phase === "fly") length += (wantLength - length) * 0.25
      else length += (Math.max(24, length * 0.3) - length) * 0.12

      for (let i = 0; i < SEGMENTS; i++) {
        const p = rope[i]
        const rvx = (p.x - p.px) * ROPE_DAMPING
        const rvy = (p.y - p.py) * ROPE_DAMPING
        p.px = p.x
        p.py = p.y
        p.x += rvx
        p.y += rvy + ROPE_GRAVITY
      }

      // Pin the ends: the knot rides the card; the loose end is tied to the
      // ring, flying toward one, or free.
      const pinEnd = (): Point | null => {
        if (phase === "tied" && ringAt) return ringAt
        if (phase === "fly" && ringAt) {
          const t = Math.min(1, elapsed / FLY_MS)
          const e = easeOutBack(t)
          // Arc up a little on the way, like a thrown line.
          const lift = Math.sin(Math.PI * Math.min(1, t)) * -40
          return { x: flyFrom.x + (ringAt.x - flyFrom.x) * e, y: flyFrom.y + (ringAt.y - flyFrom.y) * e + lift }
        }
        return null
      }

      const segment = length / (SEGMENTS - 1)
      for (let k = 0; k < ITERATIONS; k++) {
        const end = pinEnd()
        if (end) {
          rope[0].x = end.x
          rope[0].y = end.y
        }
        for (let i = 0; i < SEGMENTS - 1; i++) {
          const a = rope[i]
          const b = rope[i + 1]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.hypot(dx, dy) || 0.0001
          const diff = (d - segment) / d
          const wa = i === 0 && end ? 0 : 1
          const wb = 1
          const total = wa + wb
          a.x += dx * diff * (wa / total)
          a.y += dy * diff * (wa / total)
          b.x -= dx * diff * (wb / total)
          b.y -= dy * diff * (wb / total)
        }
        // The last point is the knot: it pulls on the card, the card pulls back.
        const tail = rope[SEGMENTS - 1]
        const dx = tail.x - box.x
        const dy = tail.y - box.y
        box.x += dx * BOX_GIVE * (phase === "leave" ? 0 : 1)
        box.y += dy * BOX_GIVE * (phase === "leave" ? 0 : 1)
        tail.x = box.x
        tail.y = box.y
      }

      if (phase === "fly" && elapsed >= FLY_MS && ringAt) {
        // Tied on: twang the string and switch the card.
        phase = "tied"
        tied = heading
        if (heading !== null) onConnectRef.current(heading)
        const nx = -(box.y - ringAt.y)
        const ny = box.x - ringAt.x
        const nd = Math.hypot(nx, ny) || 1
        for (let i = 2; i < SEGMENTS - 2; i++) {
          const s = Math.sin((Math.PI * i) / (SEGMENTS - 1)) * 7
          rope[i].px -= (nx / nd) * s
          rope[i].py -= (ny / nd) * s
        }
        spin += 2.5
      }

      // --- the card's swing about its knot --------------------------------
      const bvx = box.x - box.px
      spin += -tilt * SWING_SPRING - (bvx - lastVx) * SWING_DRIVE - bvx * 0.12
      spin *= SWING_DAMPING
      tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, tilt + spin))
      lastVx = bvx

      // --- draw -----------------------------------------------------------
      const left = box.x - knotOffset
      const top = box.y
      cardEl.style.transformOrigin = `${knotOffset}px 0px`
      cardEl.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(${tilt}deg)`

      let d = `M ${rope[0].x} ${rope[0].y}`
      for (let i = 1; i < SEGMENTS - 1; i++) {
        const mx = (rope[i].x + rope[i + 1].x) / 2
        const my = (rope[i].y + rope[i + 1].y) / 2
        d += ` Q ${rope[i].x} ${rope[i].y} ${mx} ${my}`
      }
      d += ` L ${box.x} ${box.y}`
      path.setAttribute("d", d)
      ring.setAttribute("cx", String(rope[0].x))
      ring.setAttribute("cy", String(rope[0].y))
      knot.setAttribute("cx", String(box.x))
      knot.setAttribute("cy", String(box.y))
      return true
    }

    // Motion off: no string. Hovering a project shows its card in a fixed
    // spot in the middle of the free column; it rises in softly (or just fades,
    // with the OS reduced-motion setting) and swaps as you move between
    // projects.
    let quietShown: number | null = null
    let rise = 0
    const stillFrame = (w: number, h: number) => {
      svg.style.opacity = "0"
      // Physics restarts from scratch if motion comes back on.
      phase = "idle"
      tied = heading = null
      const wanted = target.current
      if (wanted === null) {
        if (quietShown !== null) cardEl.style.opacity = "0"
        quietShown = null
        return
      }
      if (quietShown !== wanted) {
        onConnectRef.current(wanted)
        rise = quietShown === null ? 14 : 5
        quietShown = wanted
        cardEl.style.opacity = "1"
      }
      rise = reduced.matches ? 0 : rise * 0.86
      const laneBox = laneEl.getBoundingClientRect()
      // Centred in the free column, halfway down the screen.
      const left = laneBox.left + (laneBox.width - w) / 2
      const top = (window.innerHeight - h) / 2
      const scale = 1 - rise * 0.0015
      cardEl.style.transformOrigin = "50% 50%"
      cardEl.style.transform = `translate3d(${left}px, ${top + rise}px, 0) scale(${scale})`
    }

    // Hide everything and forget the string, so nothing is left hanging when
    // the section scrolls away or the screen gets too narrow for the card.
    const reset = () => {
      cardEl.style.opacity = "0"
      svg.style.opacity = "0"
      phase = "idle"
      tied = heading = null
      quietShown = null
      last = 0
    }

    // Only wide screens with a real pointer get the card at all.
    const wide = window.matchMedia("(min-width: 1024px) and (hover: hover)")

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (!wide.matches) {
        if (phase !== "idle" || quietShown !== null) reset()
        return
      }
      const w = cardEl.offsetWidth
      const h = cardEl.offsetHeight
      if (still()) {
        stillFrame(w, h)
        last = now
        return
      }
      // Fixed 60 Hz steps, so the feel is the same on 120 Hz screens.
      const steps = last ? Math.max(1, Math.min(3, Math.round((now - last) / 16.67))) : 1
      last = now
      if (quietShown !== null) {
        // Motion just came back on mid-hover: start the string fresh.
        quietShown = null
        cardEl.style.opacity = "0"
      }
      for (let s = 0; s < steps; s++) step(now, w, h)
    }

    // Only run while the projects section is on screen.
    const section = laneEl.closest("section") ?? laneEl
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === running) return
      running = entry.isIntersecting
      if (running) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else {
        // Scrolled away (however fast): the loop stops, so clear the card
        // first or it would stay frozen on screen over the next section.
        cancelAnimationFrame(frame)
        reset()
      }
    })
    observer.observe(section)
    window.addEventListener("pointermove", onPointer, { passive: true })

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onPointer)
    }
  }, [mounted, anchors, lane])

  if (!mounted) return null

  return createPortal(
    <div aria-hidden="true" className="hidden lg:block">
      <div
        ref={cardRef}
        className="pointer-events-none fixed left-0 top-0 z-20 w-[min(30.8rem,33vw)] rounded-md bg-background opacity-0 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.35)] transition-opacity duration-300 will-change-transform"
      >
        {children}
      </div>
      <svg
        ref={svgRef}
        className="pointer-events-none fixed inset-0 z-20 size-full text-foreground/55 opacity-0 transition-opacity duration-300"
      >
        {/* The string hangs in front of the card, like a real one would. */}
        <path ref={pathRef} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle ref={ringRef} r="4" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" />
        <circle ref={knotRef} r="3" className="fill-primary" />
      </svg>
    </div>,
    document.body,
  )
}
