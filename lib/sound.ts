// The site's sound, made live in the browser (Web Audio): nothing is loaded.
// It is off until the visitor switches it on (the corner control), which is
// also the click browsers need before they play anything.
//
// The kit in use is "phosphor": the name's dots as pixels on an old screen.
// Pushing dots aside clicks like a counter, a held clump charges up, a throw
// discharges, and the dots coming home print back like a dot-matrix head.
// "grain" (every dot a grain of sand) is kept below, unused, for later: set
// KIT to "grain" to hear it.

type Kit = "phosphor" | "grain"
const KIT: Kit = "phosphor"

const KEY = "sound"
const VOLUME = 0.55

// ---------------------------------------------------------------- the switch

let on = false
let listeners: Array<() => void> = []

export function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((listener) => listener !== callback)
  }
}

export function getSnapshot() {
  return on
}

export function getServerSnapshot() {
  return false
}

/** True only while sound is on and playing: cheap enough to check every frame. */
export function soundOn() {
  return on && !!ac && ac.state === "running"
}

/** Switch sound on or off. Call from a click, so the browser lets it play. */
export function setSound(next: boolean) {
  on = next
  try {
    localStorage.setItem(KEY, next ? "on" : "off")
  } catch {}
  if (next) {
    unlock()
    // A little power-on, once the context is running.
    void ac?.resume().then(() => soundEvent("open"))
  } else {
    void ac?.suspend()
  }
  listeners.forEach((listener) => listener())
}

/**
 * Restores a visitor's "on" after the first click or key press of the visit
 * (browsers won't start sound before one). Returns the cleanup.
 */
export function restoreSound() {
  let wanted = false
  try {
    wanted = localStorage.getItem(KEY) === "on"
  } catch {}
  if (!wanted) return () => {}
  const start = () => {
    stop()
    on = true
    unlock()
    void ac?.resume()
    listeners.forEach((listener) => listener())
  }
  const stop = () => {
    window.removeEventListener("pointerdown", start, true)
    window.removeEventListener("keydown", start, true)
  }
  window.addEventListener("pointerdown", start, true)
  window.addEventListener("keydown", start, true)
  return stop
}

// ---------------------------------------------------------------- the engine

let ac: AudioContext | null = null
let master: GainNode
let verbIn: GainNode
let noise: AudioBuffer
let voices = 0
const MAX_VOICES = 90
let bed: { set: (density: number) => void } | null = null
let printQueue = 0
let printNext = 0
let smooth = 0

function unlock() {
  if (ac) return
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return
  ac = new AC()
  const comp = ac.createDynamicsCompressor()
  comp.threshold.value = -20
  comp.knee.value = 12
  comp.ratio.value = 4
  comp.attack.value = 0.004
  comp.release.value = 0.18
  const out = ac.createGain()
  out.gain.value = VOLUME
  master = ac.createGain()
  master.connect(comp).connect(out).connect(ac.destination)

  // A small room, made of decaying noise.
  const conv = ac.createConvolver()
  const len = Math.floor(ac.sampleRate * 2.2)
  const ir = ac.createBuffer(2, len, ac.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
  }
  conv.buffer = ir
  verbIn = ac.createGain()
  verbIn.gain.value = 0.32
  verbIn.connect(conv).connect(master)

  noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate)
  const nd = noise.getChannelData(0)
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

  bed = makeBed(ac)
}

const panTo = (u: number) => Math.max(-0.85, Math.min(0.85, (u * 2 - 1) * 0.8))

function route(node: AudioNode, pan: number, wet = 0) {
  const p = ac!.createStereoPanner()
  p.pan.value = pan
  node.connect(p)
  p.connect(master)
  if (wet) {
    const s = ac!.createGain()
    s.gain.value = wet
    p.connect(s).connect(verbIn)
  }
}

function finish(src: AudioScheduledSourceNode, t: number) {
  voices++
  src.onended = () => voices--
  src.stop(t)
}

/** A tiny square blip, high-passed to a click. */
function blip(t: number, f: number, dur: number, g: number, pan: number, wet = 0) {
  if (!ac || voices > MAX_VOICES) return
  const o = ac.createOscillator()
  o.type = "square"
  o.frequency.value = f
  const hp = ac.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.value = 1200
  const e = ac.createGain()
  e.gain.setValueAtTime(g, t)
  e.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(hp).connect(e)
  route(e, pan, wet)
  o.start(t)
  finish(o, t + dur + 0.01)
}

/** A few milliseconds of band-passed noise: one grain of sand. */
function grain(t: number, f: number, q: number, dur: number, g: number, pan: number, wet = 0) {
  if (!ac || voices > MAX_VOICES) return
  const s = ac.createBufferSource()
  s.buffer = noise
  const bp = ac.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = f
  bp.Q.value = q
  const e = ac.createGain()
  e.gain.setValueAtTime(0, t)
  e.gain.linearRampToValueAtTime(g, t + 0.0012)
  e.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  s.connect(bp).connect(e)
  route(e, pan, wet)
  s.start(t, Math.random() * 0.9)
  finish(s, t + dur + 0.02)
}

function crusher(steps: number) {
  const ws = ac!.createWaveShaper()
  const curve = new Float32Array(1024)
  for (let i = 0; i < 1024; i++) curve[i] = Math.round((i / 511.5 - 1) * steps) / steps
  ws.curve = curve
  return ws
}

/** An oscillator gliding from f0 to f1, optionally bit-crushed and low-passed. */
function sweep(
  t: number,
  type: OscillatorType,
  f0: number,
  f1: number,
  dur: number,
  g: number,
  pan: number,
  opts: { crush?: number; lp?: number; attack?: number; wet?: number } = {},
) {
  if (!ac || voices > MAX_VOICES) return
  const o = ac.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(f0, t)
  o.frequency.exponentialRampToValueAtTime(f1, t + dur)
  let node: AudioNode = o
  if (opts.crush) node = node.connect(crusher(opts.crush))
  if (opts.lp) {
    const lp = ac.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = opts.lp
    node = node.connect(lp)
  }
  const e = ac.createGain()
  e.gain.setValueAtTime(0, t)
  e.gain.linearRampToValueAtTime(g, t + (opts.attack ?? 0.005))
  e.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  node.connect(e)
  route(e, pan, opts.wet ?? 0)
  o.start(t)
  finish(o, t + dur + 0.02)
}

/** The continuous layer, heard while dots are held in a clump. */
function makeBed(ctx: AudioContext) {
  const t = ctx.currentTime
  const g = ctx.createGain()
  g.gain.value = 0
  if (KIT === "grain") {
    // sand pouring into a funnel
    const s = ctx.createBufferSource()
    s.buffer = noise
    s.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.Q.value = 7
    bp.frequency.value = 500
    s.connect(bp).connect(g)
    s.start(t)
    route(g, 0, 0.15)
    return {
      set(d: number) {
        bp.frequency.setTargetAtTime(380 + d * d * 2600, ctx.currentTime, 0.08)
        g.gain.setTargetAtTime(d * 0.5, ctx.currentTime, 0.06)
      },
    }
  }
  // charging: a buzzing, stepped saw that climbs as the clump tightens
  const o = ctx.createOscillator()
  o.type = "sawtooth"
  const m = ctx.createOscillator()
  const mg = ctx.createGain()
  m.frequency.value = 31
  mg.gain.value = 40
  m.connect(mg).connect(o.frequency)
  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.value = 1400
  o.connect(crusher(6)).connect(lp).connect(g)
  o.start(t)
  m.start(t)
  route(g, 0, 0.15)
  return {
    set(d: number) {
      o.frequency.setTargetAtTime(70 + d * d * 520, ctx.currentTime, 0.1)
      lp.frequency.setTargetAtTime(500 + d * 3000, ctx.currentTime, 0.1)
      g.gain.setTargetAtTime(d * 0.11, ctx.currentTime, 0.06)
    },
  }
}

// ---------------------------------------------------------------- what the dots report

export type DotFrame = {
  /** Dots pushed away from their place this frame: [u, v] pairs, 0..1 across and down the name. */
  parts: number[]
  /** How many dots came home this frame, and where the first one sits across the name. */
  lands: number
  landU: number
  /** How tightly dots are gathered to a held pointer, 0..1. */
  density: number
}

/** Called once per animation frame by the dot name while sound is on. */
export function soundDots(f: DotFrame) {
  if (!soundOn()) return
  const t = ac!.currentTime + 0.01
  smooth += (f.density - smooth) * 0.2
  bed?.set(smooth)

  const count = f.parts.length / 2
  // never more than a handful of voices per frame, picked at random
  const picks = Math.min(count, KIT === "grain" ? 9 : 5)
  for (let k = 0; k < picks; k++) {
    const j = count > picks ? (Math.random() * count) | 0 : k
    const u = f.parts[j * 2]
    const v = f.parts[j * 2 + 1]
    if (KIT === "grain") {
      const amt = Math.min(1, count / 40)
      grain(t + Math.random() * 0.016, 1400 + (1 - v) * 5200 + Math.random() * 600, 9, 0.006 + Math.random() * 0.01, 0.35 + amt * 0.35, panTo(u))
    } else {
      blip(t + Math.random() * 0.016, 2400 + (1 - v) * 4200, 0.004, 0.2, panTo(u))
    }
  }

  if (KIT === "grain") {
    for (let k = 0; k < Math.min(4, f.lands); k++) grain(t + Math.random() * 0.016, 3200 + Math.random() * 3800, 14, 0.004, 0.16, panTo(f.landU))
    if (smooth > 0.05 && Math.random() < smooth * 0.9) grain(t, 900 + smooth * 3000 * Math.random(), 10, 0.01, 0.2 * smooth, (Math.random() - 0.5) * 0.6)
    return
  }

  // The name prints back in even steps, like a dot-matrix head.
  printQueue = Math.min(160, printQueue + f.lands)
  const now = ac!.currentTime
  if (printQueue > 0 && now >= printNext) {
    blip(t, 1800 + (printQueue % 3) * 220, 0.006, 0.07 + Math.min(0.08, printQueue / 1500), f.lands ? panTo(f.landU) : 0)
    printQueue = Math.max(0, printQueue - 6)
    printNext = now + 1 / 38
  }
}

// ---------------------------------------------------------------- one-off sounds

export type SoundEvent = "hover" | "click" | "throw" | "open"

/** amount: 0..1 (how much was thrown); u: 0..1, where across the screen. */
export function soundEvent(name: SoundEvent, amount = 0.5, u = 0.5) {
  if (!soundOn()) return
  const t = ac!.currentTime + 0.01
  const pan = panTo(Math.max(0, Math.min(1, u)))

  if (KIT === "grain") {
    if (name === "hover") for (let i = 0; i < 3; i++) grain(t + i * 0.011, 3600 + i * 700, 12, 0.005, 0.18, pan)
    if (name === "click") {
      sweep(t, "sine", 140, 70, 0.07, 0.22, pan)
      grain(t, 1800, 4, 0.03, 0.4, pan)
      grain(t + 0.012, 5200, 10, 0.006, 0.2, pan)
    }
    if (name === "throw") {
      const count = 60 + Math.round(amount * 260)
      for (let i = 0; i < count; i++) {
        const d = Math.pow(Math.random(), 1.8) * 0.55
        grain(t + d, 700 + Math.random() * 6200, 6 + Math.random() * 8, 0.004 + Math.random() * 0.016, 0.5 * (1 - d / 0.6) + 0.05, pan + (Math.random() - 0.5) * 1.2)
      }
      grain(t, 420, 2, 0.08, 0.55, pan, 0.2)
    }
    if (name === "open") {
      for (let i = 0; i < 140; i++) {
        const p = i / 140
        grain(t + Math.pow(p, 0.6) * 1.3, 500 + p * 5200 + Math.random() * 500, 10, 0.006, 0.12 + p * 0.25, (Math.random() - 0.5) * (1.6 - p))
      }
      sweep(t + 1.32, "sine", 160, 80, 0.09, 0.2, 0)
      grain(t + 1.32, 2600, 5, 0.025, 0.35, 0, 0.3)
    }
    return
  }

  if (name === "hover") blip(t, 3300, 0.006, 0.16, pan)
  if (name === "click") {
    sweep(t, "sine", 110, 45, 0.14, 0.4, pan)
    blip(t, 2600, 0.008, 0.2, pan)
  }
  if (name === "throw") {
    // a discharge: a crushed saw falling away, and crackle
    sweep(t, "sawtooth", 2200, 55, 0.32, 0.22, pan, { crush: 5, lp: 4000 })
    const count = 20 + Math.round(amount * 70)
    for (let i = 0; i < count; i++) blip(t + Math.pow(Math.random(), 1.6) * 0.45, 1500 + Math.random() * 6000, 0.003, 0.18, Math.random() * 1.6 - 0.8)
  }
  if (name === "open") {
    // an old screen powering on: rising hum, a faint whine, crackle, a thump
    sweep(t, "sine", 48, 96, 0.9, 0.22, 0, { attack: 0.4 })
    sweep(t + 0.1, "sine", 7800, 11800, 0.9, 0.025, 0, { attack: 0.5 })
    for (let i = 0; i < 26; i++) blip(t + 0.2 + Math.random() * 0.7, 1200 + Math.random() * 5000, 0.003, 0.12, Math.random() * 1.4 - 0.7)
    sweep(t + 0.92, "sine", 120, 50, 0.12, 0.35, 0)
    blip(t + 0.92, 2400, 0.01, 0.2, 0)
  }
}
