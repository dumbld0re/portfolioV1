import { CENTROIDS, COUNTRIES, LAND, POINTS } from "@/content/globe-land"
import { BANDS, bandOf } from "@/lib/visitors"

// The visitor globe, drawn with WebGL: every point of a Fibonacci sphere that
// lands on land is a dot, the countries people visited from light up in their
// band's colour, and each of those countries gets a pulsing marker. Dragged,
// it follows the finger and carries on spinning when let go; left alone it
// turns slowly. Orthographic, so it reads as a ball of dots.
//
// "full": the whole ball, centred, zoomable. "horizon": the top of a much
// bigger ball rising from the bottom edge, only turned sideways (the footer).

export type GlobeMode = "full" | "horizon"

export type Pick = { code: string; count: number; x: number; y: number } | null

type Options = {
  mode: GlobeMode
  countries: Record<string, number>
  you?: string | null
  /** No auto-spin and no coasting: still pictures, redrawn on input. */
  still?: boolean
  onPick?: (pick: Pick) => void
  onTap?: () => void
}

const G = Math.PI * (3 - Math.sqrt(5))
const DEG = Math.PI / 180

const VERT = `
attribute vec3 aPos;
attribute vec4 aColor;
attribute vec3 aMeta; // size, kind (0 land, 1 marker, 2 you, 3 sea), country
uniform mat3 uRot;
uniform vec2 uView;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uDot;
uniform float uPass; // 0 far side, 1 near side, 2 markers
uniform float uPick;
varying vec4 vColor;
varying float vKind;
varying float vPhase;
void main() {
  vec3 p = uRot * aPos;
  float kind = aMeta.y;
  bool marker = kind > 0.5 && kind < 2.5;
  bool show = uPass < 0.5 ? p.z < 0.0 && !marker : uPass < 1.5 ? p.z >= 0.0 && !marker : p.z >= -0.05 && marker;
  if (!show) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  vec2 px = uCenter + vec2(p.x, -p.y) * uRadius;
  gl_Position = vec4(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0, 0.0, 1.0);
  // Smaller towards the rim: the dots lie on a ball, not a disc.
  float near = clamp(p.z, 0.0, 1.0);
  float picked = abs(aMeta.z - uPick) < 0.5 ? 1.0 : 0.0;
  gl_PointSize = uDot * aMeta.x * (uPass < 0.5 ? 0.7 : 0.55 + 0.45 * sqrt(near)) * (1.0 + 0.45 * picked);
  float a = aColor.a;
  if (uPass < 0.5) a *= 0.16;
  else a *= 0.35 + 0.65 * smoothstep(0.0, 0.35, p.z);
  vColor = vec4(aColor.rgb * a, a);
  vKind = kind;
  vPhase = fract(aMeta.z * 0.137);
}`

const FRAG = `
precision mediump float;
varying vec4 vColor;
varying float vKind;
varying float vPhase;
uniform float uTime;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (vKind > 0.5 && vKind < 2.5) {
    // A marker: a solid core and a ring that keeps pulsing out of it.
    float core = 1.0 - smoothstep(0.26, 0.34, r);
    float t = fract(uTime * 0.45 + vPhase);
    float ring = (1.0 - smoothstep(0.0, 0.09, abs(r - (0.3 + 0.65 * t)))) * (1.0 - t);
    float a = max(core, ring * 0.8);
    if (a < 0.01) discard;
    gl_FragColor = vColor * a;
    return;
  }
  float a = 1.0 - smoothstep(0.6, 1.0, r);
  if (a < 0.01) discard;
  gl_FragColor = vColor * a;
}`

function hex(color: string): [number, number, number] {
  const c = color.trim()
  if (c.startsWith("#")) {
    const n = c.length === 4 ? c.slice(1).replace(/./g, "$&$&") : c.slice(1, 7)
    const v = parseInt(n, 16)
    return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]
  }
  const m = c.match(/[\d.]+/g)
  return m ? [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255] : [0.5, 0.5, 0.5]
}

function point(i: number): [number, number, number] {
  const y = 1 - (2 * (i + 0.5)) / POINTS
  const r = Math.sqrt(1 - y * y)
  const lon = i * G
  return [r * Math.sin(lon), y, r * Math.cos(lon)]
}

function fromLatLon(lat: number, lon: number): [number, number, number] {
  const c = Math.cos(lat * DEG)
  return [c * Math.sin(lon * DEG), Math.sin(lat * DEG), c * Math.cos(lon * DEG)]
}

/** Every land dot once, decoded from the packed string: [point index, country index]. */
let land: Int32Array | null = null
function landDots() {
  if (land) return land
  const raw = atob(LAND)
  const out: number[] = []
  let i = -1
  for (let k = 0; k < raw.length; ) {
    let gap = 0
    while (raw.charCodeAt(k) === 255) {
      gap += 255
      k++
    }
    gap += raw.charCodeAt(k++)
    const c = raw.charCodeAt(k++) - 1
    i += gap + 1
    out.push(i, c)
  }
  land = Int32Array.from(out)
  return land
}

export class GlobeEngine {
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private buffer: WebGLBuffer
  private count = 0
  private loc: Record<string, WebGLUniformLocation | null> = {}
  private opts: Options
  private yaw: number
  private pitch: number
  private zoom = 1
  private vYaw = 0
  private vPitch = 0
  private dragging = false
  private lastInput = -1e9
  private raf = 0
  private visible = true
  private start = performance.now()
  private picked = -1
  private pickedCode: string | null = null
  private size = { w: 0, h: 0, dpr: 1 }
  private pointers = new Map<number, { x: number; y: number }>()
  private moved = 0
  private pinch = 0
  private lastMove = { t: 0, x: 0, y: 0 }
  private cleanup: (() => void)[] = []
  /** Unit vectors of the land dots, for picking. */
  private dots: Float32Array = new Float32Array(0)
  private dotCountry: Int32Array = new Int32Array(0)

  constructor(
    private canvas: HTMLCanvasElement,
    options: Options,
  ) {
    this.opts = options
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true })
    if (!gl) throw new Error("no webgl")
    this.gl = gl
    this.program = this.link()
    this.buffer = gl.createBuffer()!
    for (const name of ["uRot", "uView", "uCenter", "uRadius", "uDot", "uPass", "uPick", "uTime"]) {
      this.loc[name] = gl.getUniformLocation(this.program, name)
    }

    // Start over the visitor's own country when we know it, else over Africa,
    // where most of the dots are lit.
    const home = (options.you && CENTROIDS[options.you]) || [8, 18]
    this.yaw = -home[1] * DEG
    this.pitch = options.mode === "horizon" ? -26 * DEG : Math.max(-0.9, Math.min(0.9, home[0] * DEG * 0.8))

    this.build()
    this.bind()
    this.resize()
    this.loop()
  }

  private link() {
    const gl = this.gl
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader")
      return s
    }
    const p = gl.createProgram()!
    gl.attachShader(p, shader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link")
    return p
  }

  /** (Re)fills the vertex buffer: on start, new numbers and a theme change. */
  build() {
    const css = getComputedStyle(document.documentElement)
    const dark = document.documentElement.classList.contains("dark")
    const landColor = hex(css.getPropertyValue("--map-land") || "#c9c9c9")
    const ink = hex(css.getPropertyValue("--foreground") || "#1c1c1c")
    const bands = BANDS.map((b) => hex(b.color))
    const { countries, you } = this.opts
    const visits = COUNTRIES.map((c) => countries[c] ?? 0)

    const data: number[] = []
    const push = (p: number[], rgb: number[], a: number, size: number, kind: number, country: number) =>
      data.push(p[0], p[1], p[2], rgb[0], rgb[1], rgb[2], a, size, kind, country)

    // The sea: a sparse, faint dotting of the rest of the ball, so it reads
    // as a sphere even where there is no land.
    const dots = landDots()
    const isLand = new Uint8Array(POINTS)
    for (let k = 0; k < dots.length; k += 2) isLand[dots[k]] = 1
    for (let i = 0; i < POINTS; i++) {
      if (!isLand[i]) push(point(i), landColor, dark ? 0.16 : 0.22, 0.5, 3, -1)
    }

    const pick = new Float32Array((dots.length / 2) * 3)
    const pickCountry = new Int32Array(dots.length / 2)
    for (let k = 0; k < dots.length; k += 2) {
      const p = point(dots[k])
      const c = dots[k + 1]
      const n = visits[c]
      pick.set(p, (k / 2) * 3)
      pickCountry[k / 2] = c
      if (n > 0) push(p, bands[bandOf(n)], 1, 1.25, 0, c)
      else push(p, landColor, dark ? 0.9 : 1, 1, 0, c)
    }
    this.dots = pick
    this.dotCountry = pickCountry

    // One pulsing marker per country with visitors, sized up a little with
    // the count; "you" in the page's ink.
    COUNTRIES.forEach((code, c) => {
      const n = visits[c]
      const at = CENTROIDS[code]
      if (!n || !at) return
      push(fromLatLon(at[0], at[1]), bands[bandOf(n)], 1, 5 + Math.min(4, Math.log2(n) * 0.8), 1, c)
    })
    if (you && CENTROIDS[you]) {
      const at = CENTROIDS[you]
      push(fromLatLon(at[0], at[1]), ink, 1, 6.5, 2, COUNTRIES.indexOf(you))
    }

    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    this.count = data.length / 10
    const stride = 10 * 4
    const attr = (name: string, size: number, offset: number) => {
      const l = gl.getAttribLocation(this.program, name)
      gl.enableVertexAttribArray(l)
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, stride, offset * 4)
    }
    attr("aPos", 3, 0)
    attr("aColor", 4, 3)
    attr("aMeta", 3, 7)
    this.draw()
  }

  update(countries: Record<string, number>, you?: string | null) {
    this.opts = { ...this.opts, countries, you }
    this.build()
  }

  setStill(still: boolean) {
    this.opts.still = still
    this.kick()
  }

  /** Turns the globe to face a country (the list in the dialog). */
  focus(code: string) {
    const at = CENTROIDS[code]
    if (!at) return
    this.target = { yaw: -at[1] * DEG, pitch: Math.max(-1.1, Math.min(1.1, at[0] * DEG)) }
    this.selectCountry(code)
    this.kick()
  }

  private target: { yaw: number; pitch: number } | null = null

  resize() {
    const r = this.canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.size = { w: r.width, h: r.height, dpr }
    this.canvas.width = Math.max(1, Math.round(r.width * dpr))
    this.canvas.height = Math.max(1, Math.round(r.height * dpr))
    this.draw()
  }

  /** Where the ball sits, in CSS pixels. */
  private frame() {
    const { w, h } = this.size
    if (this.opts.mode === "horizon") {
      const radius = Math.max(240, Math.min(w * 0.82, 720))
      return { cx: w / 2, cy: 22 + radius, radius }
    }
    const radius = Math.min(w * 0.45, h * 0.4) * this.zoom
    return { cx: w / 2, cy: h / 2, radius }
  }

  private matrix() {
    const ca = Math.cos(this.yaw)
    const sa = Math.sin(this.yaw)
    const cb = Math.cos(this.pitch)
    const sb = Math.sin(this.pitch)
    // rows of Rx(pitch)·Ry(yaw)
    const m = [ca, 0, sa, sb * sa, cb, -sb * ca, -cb * sa, sb, cb * ca]
    return m
  }

  private draw() {
    const gl = this.gl
    const { dpr } = this.size
    const { cx, cy, radius } = this.frame()
    const m = this.matrix()
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.useProgram(this.program)
    // column-major
    gl.uniformMatrix3fv(this.loc.uRot, false, [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]])
    gl.uniform2f(this.loc.uView, this.canvas.width, this.canvas.height)
    gl.uniform2f(this.loc.uCenter, cx * dpr, cy * dpr)
    gl.uniform1f(this.loc.uRadius, radius * dpr)
    // About half the spacing between neighbouring dots.
    gl.uniform1f(this.loc.uDot, Math.max(1.6, radius * Math.sqrt((4 * Math.PI) / POINTS) * 0.62) * dpr)
    gl.uniform1f(this.loc.uPick, this.picked)
    gl.uniform1f(this.loc.uTime, this.opts.still ? 0.35 : (performance.now() - this.start) / 1000)
    // The horizon skips the far side: under the controls it only adds noise.
    for (const pass of this.opts.mode === "horizon" ? [1, 2] : [0, 1, 2]) {
      gl.uniform1f(this.loc.uPass, pass)
      gl.drawArrays(gl.POINTS, 0, this.count)
    }
  }

  private kick() {
    if (!this.raf && this.visible) this.raf = requestAnimationFrame(this.tick)
  }

  private loop() {
    this.kick()
  }

  private prev = performance.now()
  private tick = (now: number) => {
    this.raf = 0
    const dt = Math.min(0.05, (now - this.prev) / 1000)
    this.prev = now
    let moving = false
    if (this.target) {
      const k = 1 - Math.pow(0.002, dt)
      let dy = this.target.yaw - this.yaw
      dy = Math.atan2(Math.sin(dy), Math.cos(dy))
      this.yaw += dy * k
      this.pitch += (this.target.pitch - this.pitch) * k
      if (Math.abs(dy) < 0.001 && Math.abs(this.target.pitch - this.pitch) < 0.001) this.target = null
      moving = true
    } else if (!this.dragging) {
      if (!this.opts.still && (Math.abs(this.vYaw) > 0.0005 || Math.abs(this.vPitch) > 0.0005)) {
        this.yaw += this.vYaw * dt
        this.pitch += this.vPitch * dt
        const f = Math.pow(0.08, dt)
        this.vYaw *= f
        this.vPitch *= f
        moving = true
      }
      // Idle: a slow turn west to east, easing in after a touch.
      if (!this.opts.still && this.picked < 0 && now - this.lastInput > 1800) {
        const ease = Math.min(1, (now - this.lastInput - 1800) / 1500)
        this.yaw += dt * 0.09 * ease
        moving = true
      }
      this.clampPitch()
    }
    this.draw()
    // Markers keep pulsing while anything moves; with motion off one frame is enough.
    if (moving || this.dragging || !this.opts.still) this.kick()
  }

  private clampPitch() {
    const lim = this.opts.mode === "horizon" ? 0 : 1.25
    if (this.opts.mode === "horizon") this.pitch = -26 * DEG
    else this.pitch = Math.max(-lim, Math.min(lim, this.pitch))
  }

  private bind() {
    const el = this.canvas
    const on = <K extends keyof HTMLElementEventMap>(t: K, fn: (e: HTMLElementEventMap[K]) => void, o?: AddEventListenerOptions) => {
      el.addEventListener(t, fn as EventListener, o)
      this.cleanup.push(() => el.removeEventListener(t, fn as EventListener))
    }
    const horizon = this.opts.mode === "horizon"

    on("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId)
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      this.dragging = true
      this.target = null
      this.moved = 0
      this.vYaw = this.vPitch = 0
      this.lastMove = { t: performance.now(), x: e.clientX, y: e.clientY }
      if (this.pointers.size === 2) this.pinch = this.spread()
      this.lastInput = performance.now()
      this.kick()
    })
    on("pointermove", (e) => {
      const prev = this.pointers.get(e.pointerId)
      if (!prev) return
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      this.moved += Math.abs(dx) + Math.abs(dy)
      if (this.pointers.size === 2 && !horizon) {
        const s = this.spread()
        if (this.pinch) this.setZoom(this.zoom * (s / this.pinch))
        this.pinch = s
        return
      }
      const { radius } = this.frame()
      this.yaw += dx / radius
      if (!horizon) this.pitch += dy / radius
      this.clampPitch()
      const now = performance.now()
      const t = Math.max(1, now - this.lastMove.t) / 1000
      // Smoothed velocity, for the throw.
      this.vYaw = this.vYaw * 0.5 + (dx / radius / t) * 0.5
      this.vPitch = horizon ? 0 : this.vPitch * 0.5 + (dy / radius / t) * 0.5
      this.lastMove = { t: now, x: e.clientX, y: e.clientY }
      this.lastInput = now
    })
    const up = (e: PointerEvent) => {
      if (!this.pointers.delete(e.pointerId)) return
      if (this.pointers.size) return
      this.dragging = false
      this.pinch = 0
      this.lastInput = performance.now()
      // A pause before letting go means no throw.
      if (performance.now() - this.lastMove.t > 80) this.vYaw = this.vPitch = 0
      if (this.moved < 8 && e.type === "pointerup") {
        if (horizon) this.opts.onTap?.()
        else this.pickAt(e.clientX, e.clientY)
      }
      this.kick()
    }
    on("pointerup", up)
    on("pointercancel", up)
    if (!horizon) {
      on(
        "wheel",
        (e) => {
          e.preventDefault()
          this.setZoom(this.zoom * Math.exp(-e.deltaY * 0.0015))
          this.lastInput = performance.now()
        },
        { passive: false },
      )
    }

    const io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      if (this.visible) {
        this.prev = performance.now()
        this.kick()
      }
    })
    io.observe(el)
    this.cleanup.push(() => io.disconnect())
  }

  private spread() {
    const [a, b] = [...this.pointers.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  setZoom(z: number) {
    this.zoom = Math.max(0.75, Math.min(3, z))
    this.kick()
  }

  zoomBy(f: number) {
    this.setZoom(this.zoom * f)
    this.lastInput = performance.now()
  }

  private selectCountry(code: string | null) {
    this.pickedCode = code
    this.picked = code ? COUNTRIES.indexOf(code) : -1
    this.kick()
  }

  /** The country under a screen point, or none (the sea, off the ball). */
  private pickAt(clientX: number, clientY: number) {
    const r = this.canvas.getBoundingClientRect()
    const { cx, cy, radius } = this.frame()
    const sx = (clientX - r.left - cx) / radius
    const sy = -(clientY - r.top - cy) / radius
    const d = sx * sx + sy * sy
    if (d > 1) return this.emitPick(null)
    const v = [sx, sy, Math.sqrt(1 - d)]
    const m = this.matrix()
    // back to the globe's own frame: the transpose
    const w = [m[0] * v[0] + m[3] * v[1] + m[6] * v[2], m[1] * v[0] + m[4] * v[1] + m[7] * v[2], m[2] * v[0] + m[5] * v[1] + m[8] * v[2]]
    let best = -1
    let bestDot = Math.cos((26 / radius) * 1) // within ~26px
    const { countries } = this.opts
    // Visited countries' markers first: small places have no land dots.
    COUNTRIES.forEach((code, c) => {
      const at = CENTROIDS[code]
      if (!countries[code] || !at) return
      const p = fromLatLon(at[0], at[1])
      const dot = p[0] * w[0] + p[1] * w[1] + p[2] * w[2]
      if (dot > Math.max(bestDot, Math.cos(18 / radius))) {
        bestDot = dot
        best = c
      }
    })
    if (best < 0) {
      bestDot = Math.cos(14 / radius)
      for (let k = 0; k < this.dotCountry.length; k++) {
        const dot = this.dots[k * 3] * w[0] + this.dots[k * 3 + 1] * w[1] + this.dots[k * 3 + 2] * w[2]
        if (dot > bestDot) {
          bestDot = dot
          best = this.dotCountry[k]
        }
      }
    }
    if (best < 0) return this.emitPick(null)
    const code = COUNTRIES[best]
    if (code === this.pickedCode) return this.emitPick(null)
    this.selectCountry(code)
    this.opts.onPick?.({ code, count: countries[code] ?? 0, x: clientX - r.left, y: clientY - r.top })
  }

  private emitPick(p: Pick) {
    if (!p) this.selectCountry(null)
    this.opts.onPick?.(p)
  }

  clearPick() {
    this.selectCountry(null)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.cleanup.forEach((f) => f())
    this.gl.getExtension("WEBGL_lose_context")?.loseContext()
  }
}
