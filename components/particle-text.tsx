"use client"

import { useEffect, useImperativeHandle, useRef, useSyncExternalStore, type ReactNode, type Ref } from "react"

import { motionOff, watchMotion } from "@/lib/eggs"
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
    let radius = 1.2
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
      // Dots on whole device pixels with an even step: fractional spacing
      // shows up as stripes across small letters (phones).
      const snap = (v: number) => Math.max(3, Math.round(v * dpr)) / dpr
      const gap = snap(Math.min(3.7, Math.max(2.4, size / 58)))
      radius = gap * 0.36
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
      const left = bases[0].left - box.left + pad
      const top = bases[0].bottom - box.top + pad
      words.forEach((word, i) => {
        const baseline = top + i * lineHeight
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
      const collect = (g: number) => {
        const pts: number[] = []
        const flags: number[] = []
        for (let gy = 0; gy < off.height; gy += g) {
          for (let gx = 0; gx < off.width; gx += g) {
            const k = (Math.floor(gy) * off.width + Math.floor(gx)) * 4
            if (data[k + 3] < 140) continue
            pts.push(Math.round((originX + gx) * dpr) / dpr, Math.round((originY + gy) * dpr) / dpr)
            flags.push(data[k + 1] < 120 ? 1 : 0)
          }
        }
        return { pts, flags }
      }
      let found = collect(gap)
      // Keep the count in a range any laptop animates smoothly: widen the grid if needed.
      if (found.flags.length > MAX_DOTS) {
        const wider = snap(gap * Math.sqrt(found.flags.length / MAX_DOTS) + 0.5 / dpr)
        radius = wider * 0.36
        found = collect(wider)
      }
      return { pts: Float32Array.from(found.pts), flags: Uint8Array.from(found.flags) }
    }

    // Hands every dot a place. More places than dots: new dots split off from
    // existing ones. Fewer: the spare dots double up on places already taken.
    const assign = (pts: Float32Array, flags: Uint8Array) => {
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
      for (let i = m - 1; i > 0; i--) {
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
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
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
      if (go && !el.dataset.dots) el.dataset.dots = ""
      let energy = 0
      const wellOn = down && now - downAt > 140
      const floor = h - 6

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
        energy += Math.abs(vx[i]) + Math.abs(vy[i]) + (falling ? 0 : Math.abs(tx[i] - x[i]) + Math.abs(ty[i] - y[i]))
      }

      if (vertices.length !== n * 3) vertices = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        vertices[i * 3] = x[i]
        vertices[i * 3 + 1] = y[i]
        vertices[i * 3 + 2] = hot[i]
      }
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
      gl.uniform1f(uSize, radius * 2 * dpr * 1.3)
      gl.uniform1f(uAlpha, go ? Math.min(1, since / 500) : 0)
      gl.drawArrays(gl.POINTS, 0, n)

      // Rest once everything has settled; any input wakes the loop again.
      const busy = !go || energy / Math.max(1, n) > 0.02 || wellOn
      if (visible && busy) raf = requestAnimationFrame(step)
    }
    const kick = () => {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(step)
    }

    const build = (first: boolean) => {
      resize()
      readColors()
      const { pts, flags } = sample(baseLines)
      assign(pts, flags)
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

    const toStage = (e: PointerEvent) => {
      const box = stage.getBoundingClientRect()
      px = e.clientX - box.left
      py = e.clientY - box.top
      return px >= 0 && py >= 0 && px <= box.width && py <= box.height
    }
    const onMove = (e: PointerEvent) => {
      if (toStage(e) || down) kick()
    }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return
      if ((e.target as Element | null)?.closest?.("a, button, input, textarea, label")) return
      if (!toStage(e)) return
      // Only a press on or right beside the heading: text elsewhere stays selectable.
      const box = el.getBoundingClientRect()
      if (e.clientX < box.left - 40 || e.clientX > box.right + 40 || e.clientY < box.top - 40 || e.clientY > box.bottom + 40) return
      down = true
      downAt = performance.now()
      kick()
    }
    const onUp = () => {
      if (!down) return
      const held = performance.now() - downAt
      down = false
      // Letting go of a gathered clump throws it.
      if (held > 320) {
        for (let i = 0; i < n; i++) {
          const dx = x[i] - px
          const dy = y[i] - py
          const d = Math.hypot(dx, dy) || 1
          if (d < reach * 3.2) {
            const p = (1 - d / (reach * 3.2)) * 30
            vx[i] += (dx / d) * p
            vy[i] += (dy / d) * p
          }
        }
      }
      kick()
    }
    const onLeave = () => {
      px = py = -9999
    }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
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
      ro.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      delete el.dataset.live
      delete el.dataset.dots
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
