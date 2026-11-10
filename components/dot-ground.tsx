"use client"

import { useEffect, useRef } from "react"

import { motionOff, watchMotion } from "@/lib/eggs"

const GRID = 30
const LENS = 170
/** How strong the resting dots are (of the text colour). */
const REST = 0.17

// The page's ground: a grid of faint dots behind everything. Near the pointer
// they swell, warm to amber and lean away; a click sends a ring out through
// them; the window event "dots:pulse" sends several, in amber. With motion
// off (reduced motion, "pause animation") the grid just sits there.
//
// Sticky inside an absolute layer rather than fixed: Safari tints its bars
// from fixed elements at the viewport's edges and doesn't repaint that tint
// on a theme switch.
export function DotGround() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let w = 0
    let h = 0
    let ink = "#fff"
    let amber = "#d79921"
    let raf = 0
    let px = -9999
    let py = -9999
    let moved = 0
    let rings: { x: number; y: number; at: number; hot: boolean }[] = []

    const readColors = () => {
      const cs = getComputedStyle(canvas)
      ink = cs.getPropertyValue("--foreground").trim() || ink
      amber = cs.getPropertyValue("--primary").trim() || amber
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      raf = 0
      rings = rings.filter((r) => now - r.at < 1800)
      ctx.clearRect(0, 0, w, h)
      const ox = (w % GRID) / 2
      const oy = (h % GRID) / 2
      const far = Math.max(w, h) * 0.9
      const stirred: number[] = []

      // The resting dots in one faint pass; the stirred ones are kept for after.
      ctx.beginPath()
      for (let gy = oy; gy < h; gy += GRID) {
        for (let gx = ox; gx < w; gx += GRID) {
          let x = gx
          let y = gy
          let r = 1
          let hot = 0
          const dx = gx - px
          const dy = gy - py
          const d = Math.hypot(dx, dy)
          if (d < LENS) {
            const k = (1 - d / LENS) ** 2
            r += k * 2.6
            x += (dx / (d || 1)) * k * 14
            y += (dy / (d || 1)) * k * 14
          }
          for (const ring of rings) {
            const age = (now - ring.at) / 1800
            if (age < 0) continue
            const band = Math.abs(Math.hypot(gx - ring.x, gy - ring.y) - age * far)
            if (band < 46) {
              r += (1 - band / 46) * 3 * (1 - age)
              if (ring.hot) hot = 1
            }
          }
          if (r > 1.3) {
            stirred.push(x, y, r, hot)
            continue
          }
          ctx.moveTo(x + 1, y)
          ctx.arc(x, y, 1, 0, 6.2832)
        }
      }
      ctx.globalAlpha = REST
      ctx.fillStyle = ink
      ctx.fill()

      for (let i = 0; i < stirred.length; i += 4) {
        const r = stirred[i + 2]
        ctx.globalAlpha = Math.min(0.9, REST + (r - 1) * 0.28)
        ctx.fillStyle = stirred[i + 3] || r > 2.9 ? amber : ink
        ctx.beginPath()
        ctx.arc(stirred[i], stirred[i + 1], r, 0, 6.2832)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (rings.length || now - moved < 120) raf = requestAnimationFrame(draw)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || motionOff()) return
      const box = canvas.getBoundingClientRect()
      px = e.clientX - box.left
      py = e.clientY - box.top
      moved = performance.now()
      kick()
    }
    const onLeave = () => {
      px = py = -9999
      kick()
    }
    const onDown = (e: PointerEvent) => {
      if (motionOff()) return
      const box = canvas.getBoundingClientRect()
      rings.push({ x: e.clientX - box.left, y: e.clientY - box.top, at: performance.now(), hot: false })
      kick()
    }
    const onPulse = () => {
      if (motionOff()) return
      const now = performance.now()
      for (let i = 0; i < 4; i++) rings.push({ x: w / 2, y: h / 2, at: now + i * 260, hot: true })
      kick()
    }
    const onResize = () => {
      resize()
      kick()
    }
    // The theme and "pause animation" both show up as classes on <html>.
    const unwatch = watchMotion(() => {
      if (motionOff()) {
        px = py = -9999
        rings = []
      }
      readColors()
      kick()
    })

    resize()
    readColors()
    kick()
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("resize", onResize)
    window.addEventListener("dots:pulse", onPulse)
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      unwatch()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("dots:pulse", onPulse)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 print:hidden">
      <canvas ref={ref} className="sticky top-0 block h-lvh w-full" />
    </div>
  )
}
