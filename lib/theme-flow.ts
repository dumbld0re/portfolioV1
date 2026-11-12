import { heroName, motionOff } from "@/lib/eggs"
import { markFound, showToast } from "@/lib/secrets"

// The theme switch, poured out of the button in dots: dots in the new
// background colour flow out from the button as a halftone wave until they
// cover the screen; the theme changes underneath; a second wave from the
// button dissolves the dots again and shows the page in its new colours.
// With motion off (reduced motion, "pause animation", boring mode) the theme
// simply switches.

/** The two themes' page colours (--background in app/globals.css). */
const BACKGROUND = { light: "#ffffff", dark: "#1a1a1a" } as const

const GAP = 9 // px between dot centres
const BAND = 190 // px of the halftone edge, from no dot to solid
const R_MAX = GAP * 0.75 // a dot this big covers its whole cell
const COVER_MS = 480
const REVEAL_MS = 640

let busy = false
// Five clicks inside this long (also the ones made while a wave is still
// running): the wave on screen comes out dizzy (an egg).
const DIZZY_WINDOW_MS = 4000
const DIZZY_MS = 1600
let clicks: number[] = []
let dizzyUntil = 0

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const nextFrame = () => new Promise<number>((r) => requestAnimationFrame(r))

/**
 * Switches to `next`, pouring it out of `from` (the button). `apply` sets the
 * theme; it runs once the screen is covered.
 */
export async function flowTheme(
  from: HTMLElement,
  next: "light" | "dark",
  apply: () => void,
  dizzyWords: string[] = ["make up", "your mind"],
) {
  const now = performance.now()
  clicks = [...clicks.filter((t) => now - t < DIZZY_WINDOW_MS), now]
  if (clicks.length >= 5) {
    clicks = []
    dizzyUntil = now + DIZZY_MS
    // The name says it; on a page without the name, a note does.
    const name = heroName()
    if (name && !motionOff()) name.morph(dizzyWords, 3400)
    else showToast(dizzyWords.join(" "))
    markFound("dizzy")
  }
  if (busy) return
  if (motionOff()) {
    apply()
    return
  }
  busy = true

  const box = from.getBoundingClientRect()
  const ox = box.left + box.width / 2
  const oy = box.top + box.height / 2
  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const far = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy))
  const reach = far + BAND + R_MAX

  const canvas = document.createElement("canvas")
  canvas.setAttribute("aria-hidden", "true")
  canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:9998;pointer-events:none"
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    busy = false
    apply()
    return
  }
  document.body.appendChild(canvas)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = BACKGROUND[next]

  // The grid is laid from the button, so a dot sits right on it.
  const x0 = ox - Math.ceil(ox / GAP) * GAP
  const y0 = oy - Math.ceil(oy / GAP) * GAP

  // Dizzy: the dots swirl around the button, more the further out they are.
  let spin = 0
  /** Dots sized by `size(distance)`, 0..1, for every cell in the band [inner, outer]. */
  const band = (inner: number, outer: number, size: (d: number) => number) => {
    ctx.beginPath()
    const top = Math.max(y0, oy - outer - GAP)
    const bottom = Math.min(h + GAP, oy + outer + GAP)
    for (let y = y0 + Math.ceil((top - y0) / GAP) * GAP; y <= bottom; y += GAP) {
      const dy = y - oy
      const span = Math.sqrt(Math.max(0, outer * outer - dy * dy))
      const left = Math.max(x0, ox - span - GAP)
      const right = Math.min(w + GAP, ox + span + GAP)
      for (let x = x0 + Math.ceil((left - x0) / GAP) * GAP; x <= right; x += GAP) {
        const d = Math.hypot(x - ox, dy)
        if (d < inner || d > outer) continue
        const r = size(d) * R_MAX
        if (r < 0.35) continue
        let px = x
        let py = y
        if (spin) {
          const a = spin * (d / far)
          const c = Math.cos(a)
          const s = Math.sin(a)
          px = ox + (x - ox) * c - dy * s
          py = oy + (x - ox) * s + dy * c
        }
        ctx.moveTo(px + r, py)
        ctx.arc(px, py, r, 0, Math.PI * 2)
      }
    }
    ctx.fill()
  }

  const run = async (ms: number, ease: (t: number) => number, frame: (r: number) => void) => {
    const start = await nextFrame()
    for (let now = start; ; now = await nextFrame()) {
      const t = Math.min(1, (now - start) / ms)
      // Dizzy: a swirl that winds up and unwinds again.
      const left = dizzyUntil - now
      spin = left > 0 ? Math.sin((1 - left / DIZZY_MS) * Math.PI) * 6 : 0
      ctx.clearRect(0, 0, w, h)
      frame(ease(t) * reach)
      if (t >= 1) break
    }
  }

  try {
    // Out of the button: solid behind the front, dots growing towards it.
    await run(COVER_MS, easeInOut, (r) => {
      const solid = r - BAND
      if (solid > 0) {
        ctx.beginPath()
        ctx.arc(ox, oy, solid, 0, Math.PI * 2)
        ctx.fill()
      }
      band(Math.max(0, solid), r, (d) => (r - d) / BAND)
    })
    ctx.fillRect(0, 0, w, h)

    apply()
    // Let the new theme render and paint under the cover.
    await nextFrame()
    await nextFrame()

    // And away again, from the button: the page shows through as the dots
    // shrink. It starts fast, so the screen is never fully covered for long.
    await run(REVEAL_MS, easeOut, (r) => {
      ctx.beginPath()
      ctx.rect(0, 0, w, h)
      ctx.arc(ox, oy, r, 0, Math.PI * 2)
      ctx.fill("evenodd")
      band(Math.max(0, r - BAND), r, (d) => (d - (r - BAND)) / BAND)
    })
  } finally {
    canvas.remove()
    busy = false
  }
}
