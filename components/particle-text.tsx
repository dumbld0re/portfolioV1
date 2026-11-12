"use client"

import { useEffect, useImperativeHandle, useRef, useSyncExternalStore, type ReactNode, type Ref } from "react"

import { motionOff, watchMotion } from "@/lib/eggs"
import { soundDots, soundEvent, soundOn } from "@/lib/sound"
import { cn } from "@/lib/utils"

// A heading drawn in dots. The real text stays in the page (for readers,
// search and layout) but is made transparent; a canvas across the nearest
// [data-stage] ancestor draws one dot for every few pixels of its letters.
// The dots are loose: they fly in, give way to the cursor, can be pulled
// together by a held mouse button, thrown, dropped and re-formed into other
// words. With motion off (reduced motion, "pause animation", boring mode) or
// without WebGL nothing here runs and the text shows as text.

export type ParticleTextHandle = {
  /** Spells other words for a while, then the heading again. */
  morph: (lines: string[], ms?: number) => void
  /** Throws every dot outwards. */
  scatter: (power?: number) => void
  /** Lets the dots drop to the floor of the stage until `rise`. */
  fall: () => void
  rise: () => void
  /** Sends every dot somewhere random, to gather again. */
  regroup: () => void
}

type Props = {
  as?: "h1" | "h2"
  lines: string[]
  className?: string
  /** A character drawn in the accent colour. */
  accent?: string
  /** Set after the last line, inside it (the hero's blinking caret). */
  after?: ReactNode
  /** Wait this long after mount before the dots gather (ms). */
  delay?: number
  /** Gather only once the heading scrolls into view. */
  whenVisible?: boolean
  ref?: Ref<ParticleTextHandle>
}

const VERTEX = `
attribute vec2 p;
attribute float hot;
uniform vec2 res;
uniform float size;
uniform float lift;
varying float v;
void main() {
  vec2 c = (p + vec2(0.0, lift)) / res * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
  gl_PointSize = size;
  v = hot;
}`

const FRAGMENT = `
precision mediump float;
uniform vec3 ink;
uniform vec3 amber;
uniform float alpha;
varying float v;
void main() {
  float a = (1.0 - smoothstep(0.36, 0.5, length(gl_PointCoord - 0.5))) * alpha;
  gl_FragColor = vec4(mix(ink, amber, v) * a, a);
}`

/** "#fff" or "#d79921" to 0..1 channels. */
function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h
  const n = parseInt(full, 16)
  return Number.isNaN(n) ? [1, 1, 1] : [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const SPRING = 0.045
const DAMPING = 0.86
const MAX_DOTS = 7000
/** The physics is tuned per 60th of a second; other refresh rates run as many
 *  ticks as a 60Hz screen would have, so the motion looks the same everywhere. */
const TICK = 1000 / 60

export function ParticleText({
  as: Tag = "h1",
  lines,
  className,
  accent,
  after,
  delay = 0,
  whenVisible = false,
  ref,
}: Props) {
  const host = useRef<HTMLHeadingElement>(null)
  const still = useSyncExternalStore(watchMotion, motionOff, () => true)
  const api = useRef<ParticleTextHandle | null>(null)
  const text = lines.join("\n")

  useImperativeHandle(ref, () => ({
    morph: (l, ms) => api.current?.morph(l, ms),
    scatter: (p) => api.current?.scatter(p),
    fall: () => api.current?.fall(),
    rise: () => api.current?.rise(),
    regroup: () => api.current?.regroup(),
  }))

  useEffect(() => {
    const el = host.current
    const stage = el?.closest<HTMLElement>("[data-stage]")
    if (!el) return
    // "off": no dots this time, so the heading shows as plain text right away.
    if (!stage || still) {
      el.dataset.live = "off"
      return () => {
        delete el.dataset.live
      }
    }
    // The canvas covers the whole stage, so it is added to the stage itself
    // rather than rendered inside the heading.
    const canvas = document.createElement("canvas")
    canvas.className = "pt-canvas"
    canvas.setAttribute("aria-hidden", "true")

    // All dots go to the GPU as one batch of round points. Without WebGL the
    // heading simply stays as text.
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: true })
    if (!gl) {
      el.dataset.live = "off"
      return
    }
    stage.appendChild(canvas)
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }
    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.remove()
      el.dataset.live = "off"
      return
    }
    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    const aP = gl.getAttribLocation(program, "p")
    const aHot = gl.getAttribLocation(program, "hot")
    gl.enableVertexAttribArray(aP)
    gl.enableVertexAttribArray(aHot)
    gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 12, 0)
    gl.vertexAttribPointer(aHot, 1, gl.FLOAT, false, 12, 8)
    const uni = (name: string) => gl.getUniformLocation(program, name)
    const uRes = uni("res")
    const uLift = uni("lift")
    const uSize = uni("size")
    const uInk = uni("ink")
    const uAmber = uni("amber")
    const uAlpha = uni("alpha")
    let vertices = new Float32Array(0)
    let dpr = 1

    const baseLines = text.split("\n")
    let n = 0
    let x = new Float32Array(0)
    let y = new Float32Array(0)
    let vx = new Float32Array(0)
    let vy = new Float32Array(0)
    let tx = new Float32Array(0)
    let ty = new Float32Array(0)
    let wake = new Float32Array(0)
    let pile = new Float32Array(0)
    let hot = new Uint8Array(0)

    let w = 0
    let h = 0
    // How far the canvas reaches above the stage, up to the top of the page,
    // so dots also fly in from behind the top bar instead of leaving a gap.
    let lift = 0
    /** Each dot's size on screen, in device pixels. */
    let pointPx = 3
    let reach = 90
    let raf = 0
    let visible = false
    let started = !whenVisible
    let startAt = performance.now() + delay
    let falling = false
    let morphTimer = 0
    let disposed = false

    // pointer, in stage coordinates
    let px = -9999
    let py = -9999
    // ...and in the window, kept so a scroll can move it across the stage
    // without the pointer moving (else the dots give way to a stale spot).
    let cx: number | null = null
    let cy = 0
    let last = 0
    let down = false
    let downAt = 0

    const readColors = () => {
      const cs = getComputedStyle(el)
      gl.uniform3fv(uInk, rgb(cs.getPropertyValue("--foreground").trim() || "#fff"))
      gl.uniform3fv(uAmber, rgb(cs.getPropertyValue("--primary").trim() || "#d79921"))
    }

    // Where the letters are: draw the lines into an offscreen canvas exactly
    // where the page laid them out, then keep every few pixels that have ink.
    const sample = (words: string[]) => {
      const cs = getComputedStyle(el)
      const size = parseFloat(cs.fontSize)
      const stageBox = stage.getBoundingClientRect()
      const box = el.getBoundingClientRect()
      const bases = [...el.querySelectorAll<HTMLElement>("[data-base]")].map((b) => b.getBoundingClientRect())
      const lineHeight = bases.length > 1 ? bases[1].bottom - bases[0].bottom : size
      // The grid steps in whole device pixels, at least 3 on 1x screens and 4
      // on 2x and up, so every dot lands the same way on the screen's pixels
      // (fractional steps show as stripes and uneven dots). Small names get a
      // finer grid so thin strokes keep their dots.
      const minStep = dpr >= 2 ? 4 : 3
      const snap = (v: number) => Math.max(minStep, Math.round(v * dpr)) / dpr
      const gap = snap(Math.min(3.7, Math.max(size < 90 ? 2 : 2.4, size / 58)))
      reach = Math.max(70, size * 0.6)

      const pad = Math.ceil(size * 0.4)
      const off = document.createElement("canvas")
      off.width = Math.ceil(Math.max(box.width, stageBox.width * 0.9) + pad * 2)
      off.height = Math.ceil(lineHeight * words.length + pad * 2)
      const o = off.getContext("2d", { willReadFrequently: true })
      if (!o || !bases.length) return { pts: new Float32Array(0), flags: new Uint8Array(0) }
      o.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`
      o.textBaseline = "alphabetic"
      if ("letterSpacing" in o) (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing
      const top = bases[0].bottom - box.top + pad
      words.forEach((word, i) => {
        const baseline = top + i * lineHeight
        // The heading's own lines start where the page put each one (centred
        // headings start every line differently); other words line up with the first.
        const left = (word === baseLines[i] && bases[i] ? bases[i] : bases[0]).left - box.left + pad
        o.fillStyle = "#fff"
        o.fillText(word, left, baseline)
        // The accent character again, in red, so its dots can be told apart.
        const at = accent ? word.indexOf(accent) : -1
        if (accent && at >= 0) {
          const before = o.measureText(word.slice(0, at)).width
          o.fillStyle = "#f00"
          o.fillText(accent, left + before, baseline)
        }
      })

      const data = o.getImageData(0, 0, off.width, off.height).data
      const originX = box.left - stageBox.left - pad
      const originY = box.top - stageBox.top - pad
      nameLeft = box.left - stageBox.left
      nameTop = box.top - stageBox.top
      nameW = Math.max(1, box.width)
      nameH = Math.max(1, box.height)
      // A dot for every grid cell the letters cover by about a third or
      // more (not one pixel per cell, which misses thin strokes), placed in
      // the cell's middle. The accent's cells are told apart by their red.
      const collect = (g: number) => {
        const pts: number[] = []
        const flags: number[] = []
        // Whole-pixel dot sizes: an odd size sits on a pixel's centre, an
        // even one on the line between pixels, so each dot comes out crisp.
        const dotPx = Math.max(2, Math.round(g * dpr * 0.936))
        const nudge = dotPx % 2 ? 0.5 / dpr : 0
        const at = (v: number) => Math.round(v * dpr) / dpr + nudge
        for (let gy = 0; gy + 1 < off.height; gy += g) {
          const y0 = Math.floor(gy)
          const y1 = Math.min(off.height, Math.max(y0 + 1, Math.floor(gy + g)))
          for (let gx = 0; gx + 1 < off.width; gx += g) {
            const x0 = Math.floor(gx)
            const x1 = Math.min(off.width, Math.max(x0 + 1, Math.floor(gx + g)))
            let ink = 0
            let red = 0
            for (let yy = y0; yy < y1; yy++) {
              for (let xx = x0; xx < x1; xx++) {
                const k = (yy * off.width + xx) * 4
                const a = data[k + 3]
                ink += a
                if (a > 110 && data[k + 1] < 120) red++
              }
            }
            const cells = (y1 - y0) * (x1 - x0)
            if (ink < cells * 255 * 0.34) continue
            pts.push(at(originX + gx + g / 2), at(originY + gy + g / 2))
            flags.push(red * 2 > cells * 0.34 ? 1 : 0)
          }
        }
        return { pts, flags, dotPx }
      }
      let found = collect(gap)
      // Keep the count in a range any laptop animates smoothly: widen the grid if needed.
      if (found.flags.length > MAX_DOTS) {
        found = collect(snap(gap * Math.sqrt(found.flags.length / MAX_DOTS) + 0.5 / dpr))
      }
      pointPx = found.dotPx
      return { pts: Float32Array.from(found.pts), flags: Uint8Array.from(found.flags) }
    }

    // Hands every dot a place. More places than dots: new dots split off from
    // existing ones. Fewer: the spare dots double up on places already taken.
    const assign = (pts: Float32Array, flags: Uint8Array, shuffle = true) => {
      const m = pts.length / 2
      if (!m) return
      if (m > n) {
        const grow = <T extends Float32Array | Uint8Array>(a: T, make: (len: number) => T) => {
          const b = make(m)
          b.set(a)
          return b
        }
        const f32 = (len: number) => new Float32Array(len)
        x = grow(x, f32)
        y = grow(y, f32)
        vx = grow(vx, f32)
        vy = grow(vy, f32)
        tx = grow(tx, f32)
        ty = grow(ty, f32)
        wake = grow(wake, f32)
        pile = grow(pile, f32)
        hot = grow(hot, (len) => new Uint8Array(len))
        for (let i = n; i < m; i++) {
          if (n) {
            const from = Math.floor(Math.random() * n)
            x[i] = x[from]
            y[i] = y[from]
          } else {
            x[i] = Math.random() * w
            y[i] = Math.random() * (h + lift) - lift
            wake[i] = Math.random() * 700
          }
          pile[i] = Math.random() ** 2
        }
        n = m
      }
      // A shuffled order, so dots cross each other on the way to a new word.
      const order = Array.from({ length: m }, (_, i) => i)
      // A resize keeps the order, so each dot only shifts a little.
      for (let i = shuffle ? m - 1 : 0; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[order[i], order[j]] = [order[j], order[i]]
      }
      for (let i = 0; i < n; i++) {
        const p = order[i % m]
        tx[i] = pts[p * 2]
        ty[i] = pts[p * 2 + 1]
        hot[i] = flags[p]
      }
    }

    const resize = () => {
      const box = stage.getBoundingClientRect()
      // Drawn at the screen's real sharpness (up to 3x on phones, where the
      // stage is small): a canvas upscaled by the browser blurs the dots faint.
      dpr = Math.min(window.devicePixelRatio || 1, box.width < 768 ? 3 : 2)
      w = box.width
      h = box.height
      lift = Math.max(0, Math.round(box.top + window.scrollY))
      canvas.style.top = `${-lift}px`
      canvas.style.height = `${h + lift}px`
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round((h + lift) * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, w, h + lift)
      gl.uniform1f(uLift, lift)
    }

    const step = (now: number) => {
      raf = 0
      const since = now - startAt
      const go = started && since > 0
      const wellOn = down && now - downAt > 140
      const ticks = last ? Math.min(4, Math.max(1, Math.round((now - last) / TICK))) : 1
      last = now
      let motion = 0
      listen = soundOn()
      if (listen && away.length < n) {
        const grown = new Uint8Array(n)
        grown.set(away)
        away = grown
      }
      for (let t = 0; t < ticks; t++) motion = tick(since, go, wellOn)
      draw(go, since)
      if (listen) {
        soundDots({ parts, lands, landU, density: wellOn ? Math.min(1, dense / Math.max(1, n * 0.35)) : 0 })
        parts.length = 0
        lands = 0
      }

      // Rest once the dots have stopped moving (after the entrance, while
      // nothing is held); any input wakes the loop again.
      const busy = !go || since < 1200 || motion / Math.max(1, n) > 0.01 || wellOn
      if (visible && busy) raf = requestAnimationFrame(step)
      else {
        last = 0
        // At rest every dot is home, whether or not the sound caught it landing.
        away.fill(0)
      }
    }

    // For the sound (lib/sound.ts): which dots were pushed from their place
    // and which came home, as positions across and down the name.
    let listen = false
    let away = new Uint8Array(0)
    const parts: number[] = []
    let lands = 0
    let landU = 0.5
    let dense = 0
    let nameLeft = 0
    let nameTop = 0
    let nameW = 1
    let nameH = 1

    const tick = (since: number, go: boolean, wellOn: boolean) => {
      let motion = 0
      const floor = h - 6
      dense = 0

      for (let i = 0; i < n; i++) {
        if (falling) {
          vy[i] += 0.55
          vx[i] *= 0.985
          const rest = floor - pile[i] * 46
          if (y[i] + vy[i] > rest) {
            y[i] = rest
            vy[i] *= -0.32
            vx[i] *= 0.7
            if (Math.abs(vy[i]) < 0.6) vy[i] = 0
          }
        } else if (go && since > wake[i]) {
          vx[i] += (tx[i] - x[i]) * SPRING
          vy[i] += (ty[i] - y[i]) * SPRING
        }

        const dx = x[i] - px
        const dy = y[i] - py
        const d2 = dx * dx + dy * dy
        if (wellOn) {
          const r = reach * 3.2
          if (d2 < r * r && d2 > 1) {
            const d = Math.sqrt(d2)
            const pull = (1 - d / r) * 2.4
            // towards the pointer, with a little swirl
            vx[i] += (-dx / d) * pull + (-dy / d) * pull * 0.55
            vy[i] += (-dy / d) * pull + (dx / d) * pull * 0.55
          }
        } else if (d2 < reach * reach && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const push = (1 - d / reach) ** 2 * 3.4
          vx[i] += (dx / d) * push
          vy[i] += (dy / d) * push
        }

        if (!falling) {
          vx[i] *= DAMPING
          vy[i] *= DAMPING
        }
        x[i] += vx[i]
        y[i] += vy[i]
        motion += Math.abs(vx[i]) + Math.abs(vy[i])

        // Only dots the pointer itself moves make a sound (and later the
        // sound of coming home): the entrance and the eggs stay silent.
        if (listen) {
          const ex = x[i] - tx[i]
          const ey = y[i] - ty[i]
          const e2 = ex * ex + ey * ey
          if (!away[i]) {
            const touched = wellOn ? d2 < reach * reach * 10.24 : d2 < reach * reach
            if (e2 > 30 && touched) {
              away[i] = 1
              parts.push((tx[i] - nameLeft) / nameW, (ty[i] - nameTop) / nameH)
            }
          } else if (e2 < 1.4 && vx[i] * vx[i] + vy[i] * vy[i] < 0.3) {
            away[i] = 0
            if (!lands++) landU = (tx[i] - nameLeft) / nameW
          }
          if (wellOn && d2 < reach * reach * 0.49) dense++
        }
      }
      return motion
    }

    const draw = (go: boolean, since: number) => {
      if (vertices.length !== n * 3) vertices = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        vertices[i * 3] = x[i]
        vertices[i * 3 + 1] = y[i]
        vertices[i * 3 + 2] = hot[i]
      }
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
      gl.uniform1f(uSize, pointPx)
      gl.uniform1f(uAlpha, go ? Math.min(1, since / 500) : 0)
      gl.drawArrays(gl.POINTS, 0, n)
    }
    const kick = () => {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(step)
    }

    const build = (first: boolean) => {
      resize()
      readColors()
      const { pts, flags } = sample(baseLines)
      assign(pts, flags, first)
      // After a resize the name is simply redrawn in place (unless the dots are
      // lying on the floor, or the entrance is still under way).
      if (!first && !falling && performance.now() - startAt > 2000) {
        x.set(tx)
        y.set(ty)
        vx.fill(0)
        vy.fill(0)
      }
      if (first && n) el.dataset.live = "true"
      kick()
    }

    api.current = {
      morph(words, ms = 2600) {
        const next = sample(words)
        if (!next.pts.length) return
        falling = false
        assign(next.pts, next.flags)
        kick()
        window.clearTimeout(morphTimer)
        morphTimer = window.setTimeout(() => {
          const back = sample(baseLines)
          assign(back.pts, back.flags)
          kick()
        }, ms)
      },
      scatter(power = 26) {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * 6.2832
          const p = power * (0.3 + Math.random())
          vx[i] += Math.cos(a) * p
          vy[i] += Math.sin(a) * p
        }
        kick()
      },
      fall() {
        falling = true
        for (let i = 0; i < n; i++) vx[i] += (Math.random() - 0.5) * 5
        kick()
      },
      rise() {
        if (!falling) return
        falling = false
        kick()
      },
      regroup() {
        falling = false
        for (let i = 0; i < n; i++) {
          x[i] = Math.random() * w
          y[i] = Math.random() * (h + lift) - lift
          vx[i] = vy[i] = 0
        }
        kick()
      },
    }

    const toStage = (e?: PointerEvent) => {
      if (e) {
        cx = e.clientX
        cy = e.clientY
      }
      if (cx === null) return false
      const box = stage.getBoundingClientRect()
      px = cx - box.left
      py = cy - box.top
      return px >= -reach && py >= -reach && px <= box.width + reach && py <= box.height + reach
    }
    // Scrolling carries the stage under a still pointer.
    // Kick on the way in and on the way out, so dots that gave way always
    // come back once the pointer has gone.
    let near = false
    const track = (e?: PointerEvent) => {
      const now = toStage(e)
      if (now || near || down) kick()
      near = now
      if (!e || e.pointerType !== "touch") dwellCheck()
    }

    // The gravity well without a held button (trackpads with tap-to-click):
    // keep the pointer still on the name for a moment and the dots gather to
    // it; it follows the pointer around the name, and leaving the name throws
    // the clump like letting go of a held press.
    const DWELL_MS = 900
    let dwelling = false
    let dwellTimer = 0
    let anchorX = 0
    let anchorY = 0
    const onName = () => {
      if (cx === null) return false
      const box = el.getBoundingClientRect()
      return cx >= box.left - 40 && cx <= box.right + 40 && cy >= box.top - 40 && cy <= box.bottom + 40
    }
    const dwellCheck = () => {
      if (cx === null || !onName()) {
        window.clearTimeout(dwellTimer)
        dwellTimer = 0
        if (dwelling) release()
        return
      }
      if (dwelling || falling) return
      // Small jitters don't count as moving.
      if (dwellTimer && Math.hypot(cx - anchorX, cy - anchorY) < 6) return
      anchorX = cx
      anchorY = cy
      window.clearTimeout(dwellTimer)
      dwellTimer = window.setTimeout(() => {
        dwellTimer = 0
        if (disposed || down || falling || !onName()) return
        dwelling = true
        down = true
        downAt = performance.now()
        kick()
      }, DWELL_MS)
    }

    // Letting go of a gathered clump throws it.
    const release = () => {
      if (!down) return
      const held = performance.now() - downAt
      down = false
      dwelling = false
      if (held > 320) {
        let thrown = 0
        for (let i = 0; i < n; i++) {
          const dx = x[i] - px
          const dy = y[i] - py
          const d = Math.hypot(dx, dy) || 1
          if (d < reach * 3.2) {
            const p = (1 - d / (reach * 3.2)) * 30
            vx[i] += (dx / d) * p
            vy[i] += (dy / d) * p
            thrown++
          }
        }
        soundEvent("throw", thrown / Math.max(1, n), cx === null ? 0.5 : cx / window.innerWidth)
      }
      kick()
    }
    const onScroll = () => {
      if (cx !== null) track()
    }
    const onMove = (e: PointerEvent) => track(e)
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return
      if ((e.target as Element | null)?.closest?.("a, button, input, textarea, label")) return
      if (!toStage(e)) return
      // Only a press on or right beside the heading: text elsewhere stays selectable.
      const box = el.getBoundingClientRect()
      if (e.clientX < box.left - 40 || e.clientX > box.right + 40 || e.clientY < box.top - 40 || e.clientY > box.bottom + 40) return
      // Already gathered by keeping still: the press just takes it over.
      if (dwelling) {
        dwelling = false
        return
      }
      down = true
      downAt = performance.now()
      kick()
    }
    const onUp = (e: PointerEvent) => {
      // A finger that lifts (or turns into a scroll) leaves nothing behind.
      if (e.pointerType === "touch") {
        cx = null
        px = py = -9999
        kick()
      }
      if (dwelling) return
      release()
    }
    const onLeave = () => {
      window.clearTimeout(dwellTimer)
      dwellTimer = 0
      if (dwelling) release()
      cx = null
      px = py = -9999
      kick()
    }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      // Observing fires once straight away; only a real change rebuilds.
      const box = stage.getBoundingClientRect()
      if (Math.abs(box.width - w) < 1 && Math.abs(box.height - h) < 1) return
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => !disposed && build(false), 120)
    })
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !started) {
        started = true
        startAt = performance.now() + delay
      }
      kick()
    })
    const themeWatch = new MutationObserver(() => {
      readColors()
      kick()
    })

    document.fonts.ready.then(() => {
      if (disposed) return
      build(true)
      ro.observe(stage)
      io.observe(el)
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
      window.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("pointerdown", onDown)
      window.addEventListener("pointerup", onUp)
      window.addEventListener("pointercancel", onUp)
      document.documentElement.addEventListener("pointerleave", onLeave)
    })

    return () => {
      disposed = true
      api.current = null
      cancelAnimationFrame(raf)
      window.clearTimeout(morphTimer)
      window.clearTimeout(resizeTimer)
      window.clearTimeout(dwellTimer)
      ro.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      delete el.dataset.live
      canvas.remove()
    }
  }, [text, accent, delay, whenVisible, still])

  return (
    <Tag ref={host} className={cn("pt", className)}>
      {lines.map((line, li) => {
        const at = accent ? line.indexOf(accent) : -1
        return (
          <span key={line} className="pt-line">
            <i data-base="" />
            {at < 0 ? (
              line
            ) : (
              <>
                {line.slice(0, at)}
                <span className="pt-accent">{accent}</span>
                {line.slice(at + 1)}
              </>
            )}
            {li === lines.length - 1 && after}
          </span>
        )
      })}
    </Tag>
  )
}
