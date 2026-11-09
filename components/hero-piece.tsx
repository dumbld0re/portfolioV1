"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

/** Distance between dots, in px: close to the background's own grid. */
const SPACING = 14
/** The cursor's outline (components/custom-cursor.tsx), tip first. */
const ARROW: [number, number][] = [
  [1.5, 1.5],
  [16.78, 15.34],
  [7.42, 14.19],
  [2.28, 22.1],
]
const CENTER: [number, number] = [7, 13.3]
const ARROW_HEIGHT = 20.6
/** Which way the tip points when the shape isn't turned: up and a little left. */
const TIP_ANGLE = Math.atan2(ARROW[0][1] - CENTER[1], ARROW[0][0] - CENTER[0])
/** How much of the field the arrow fills. */
const FILL = 0.76
/** Dots within this many px of the pointer are pushed aside and warm to amber. */
const REACH = 110
/** The arrow starts to appear this long after the page loads, behind the hero text. */
const INTRO_MS = 1100

function insideArrow(x: number, y: number) {
  let inside = false
  for (let i = 0, j = ARROW.length - 1; i < ARROW.length; j = i++) {
    const [xi, yi] = ARROW[i]
    const [xj, yj] = ARROW[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

// The empty side of the hero: a field of the background's dots in which the
// site's cursor shows up large, as a halftone. It turns to point at the
// visitor's own cursor, like a compass needle, and the dots give way and warm
// to amber where the pointer passes. Still (pointing the way the real cursor
// does) with motion paused or reduced; not shown on touch or narrow screens.
export function HeroPiece({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const root = document.documentElement
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    const started = performance.now()

    let size = 0
    let count = 0
    // Per dot: where it lives, how far it has been pushed, how fast it is
    // moving, and how much it belongs to the arrow (0 to 1).
    let home = new Float32Array(0)
    let offset = new Float32Array(0)
    let speed = new Float32Array(0)
    let level = new Float32Array(0)
    let ink = ""
    let amber = ""
    let angle = 0
    let pointer: { x: number; y: number } | null = null
    let frame = 0
    let visible = false
    let seen = false

    const readColors = () => {
      const styles = getComputedStyle(root)
      ink = styles.getPropertyValue("--foreground").trim() || "#ffffff"
      amber = styles.getPropertyValue("--primary").trim() || "#d79921"
    }

    const layout = () => {
      const box = canvas.getBoundingClientRect()
      size = box.width
      if (!size) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cells = Math.floor(size / SPACING)
      const inset = (size - (cells - 1) * SPACING) / 2
      count = cells * cells
      home = new Float32Array(count * 2)
      offset = new Float32Array(count * 2)
      speed = new Float32Array(count * 2)
      level = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        home[i * 2] = inset + (i % cells) * SPACING
        home[i * 2 + 1] = inset + Math.floor(i / cells) * SPACING
      }
    }

    // One step of the piece. `settle` jumps straight to the resting picture.
    const draw = (settle: boolean) => {
      if (!size) return
      const half = size / 2
      const scale = (size * FILL) / ARROW_HEIGHT
      const box = canvas.getBoundingClientRect()
      const px = pointer ? pointer.x - box.left : 0
      const py = pointer ? pointer.y - box.top : 0
      const shown = settle || performance.now() - started > INTRO_MS

      if (settle) {
        angle = 0
      } else {
        // Point at the cursor; without one, sway a little around rest.
        const target = pointer
          ? Math.atan2(py - half, px - half) - TIP_ANGLE
          : Math.sin(performance.now() / 2600) * 0.14
        const turn = ((((target - angle + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI
        angle += turn * 0.05
      }
      const cos = Math.cos(-angle)
      const sin = Math.sin(-angle)

      ctx.clearRect(0, 0, size, size)
      for (let i = 0; i < count; i++) {
        const hx = home[i * 2]
        const hy = home[i * 2 + 1]

        // The dot's place in the arrow's own (unturned) coordinates.
        const rx = hx - half
        const ry = hy - half
        const inside = shown && insideArrow((rx * cos - ry * sin) / scale + CENTER[0], (rx * sin + ry * cos) / scale + CENTER[1])
        level[i] = settle ? (inside ? 1 : 0) : level[i] + ((inside ? 1 : 0) - level[i]) * 0.1

        let near = 0
        if (settle) {
          offset[i * 2] = offset[i * 2 + 1] = speed[i * 2] = speed[i * 2 + 1] = 0
        } else {
          if (pointer) {
            const dx = hx + offset[i * 2] - px
            const dy = hy + offset[i * 2 + 1] - py
            const distance = Math.hypot(dx, dy) || 1
            if (distance < REACH) {
              near = 1 - distance / REACH
              speed[i * 2] += (dx / distance) * near * near * 1.4
              speed[i * 2 + 1] += (dy / distance) * near * near * 1.4
            }
          }
          // A soft spring pulls every dot back home.
          speed[i * 2] = (speed[i * 2] - offset[i * 2] * 0.05) * 0.84
          speed[i * 2 + 1] = (speed[i * 2 + 1] - offset[i * 2 + 1] * 0.05) * 0.84
          offset[i * 2] += speed[i * 2]
          offset[i * 2 + 1] += speed[i * 2 + 1]
        }

        // The field thins out towards its edge, so it has no outline.
        const edge = Math.hypot(rx, ry) / half
        const fade = edge < 0.7 ? 1 : Math.max(0, 1 - (edge - 0.7) / 0.3)
        if (fade <= 0) continue

        ctx.globalAlpha = (0.22 + level[i] * 0.6 + near * 0.2) * fade
        ctx.fillStyle = near > 0.3 ? amber : ink
        ctx.beginPath()
        ctx.arc(hx + offset[i * 2], hy + offset[i * 2 + 1], 0.8 + level[i] * 1.9, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = () => {
      draw(false)
      frame = requestAnimationFrame(tick)
    }

    // Runs only while it's on screen and motion is wanted; otherwise it rests.
    const sync = () => {
      const run = visible && !document.hidden && !still.matches && !root.classList.contains("paused")
      if (run && !frame) frame = requestAnimationFrame(tick)
      if (!run) {
        cancelAnimationFrame(frame)
        frame = 0
        // Before it has ever been on screen there is nothing to rest yet.
        if (seen) draw(true)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") pointer = { x: event.clientX, y: event.clientY }
    }
    const onLeave = () => {
      pointer = null
    }
    const restyle = () => {
      readColors()
      sync()
    }
    const resize = new ResizeObserver(() => {
      layout()
      sync()
    })
    const watch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      seen ||= visible
      sync()
    })
    // The theme and "pause animation" both live in <html>'s classes.
    const classes = new MutationObserver(restyle)

    readColors()
    layout()
    resize.observe(canvas)
    watch.observe(canvas)
    classes.observe(root, { attributes: true, attributeFilter: ["class"] })
    window.addEventListener("pointermove", onMove, { passive: true })
    root.addEventListener("pointerleave", onLeave)
    document.addEventListener("visibilitychange", sync)
    still.addEventListener("change", sync)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      watch.disconnect()
      classes.disconnect()
      window.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", sync)
      still.removeEventListener("change", sync)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none aspect-square print:hidden", className)} />
}
