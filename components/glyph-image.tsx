"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

import { useMediaQuery } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

const CELL = 5
const RESOLVE_MS = 700
const SCATTER_MS = 420

type Cell = { x: number; y: number; ink: number; delay: number }

function luminance(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

// A screenshot redrawn as a halftone of dots, in the site's own colors, the
// same dots as the drifting background. Ink is how far a cell sits from the
// page's dominant tone, so light and dark sites both read as their content.
// Each new image resolves in from scattered noise.
export function GlyphImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let cancelled = false
    let raf = 0
    let cells: Cell[] = []
    let start = 0
    const image = new Image()

    const css = getComputedStyle(document.documentElement)
    const ink = css.getPropertyValue("--foreground").trim() || "#ebdbb2"
    const accent = css.getPropertyValue("--primary").trim() || "#d79921"

    const layout = () => {
      if (!image.naturalWidth) return
      const width = wrap.clientWidth
      const height = wrap.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Fit the image inside the frame ("contain"), on whole cells.
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight)
      const cols = Math.floor((image.naturalWidth * scale) / CELL)
      const rows = Math.floor((image.naturalHeight * scale) / CELL)
      // Not laid out yet (e.g. inside a hidden panel): wait for the resize.
      if (cols < 1 || rows < 1) {
        cells = []
        return
      }
      const offsetX = (width - cols * CELL) / 2
      const offsetY = (height - rows * CELL) / 2

      const sample = document.createElement("canvas")
      sample.width = cols
      sample.height = rows
      const sctx = sample.getContext("2d", { willReadFrequently: true })
      if (!sctx) return
      sctx.drawImage(image, 0, 0, cols, rows)
      const data = sctx.getImageData(0, 0, cols, rows).data

      const lums = new Float32Array(cols * rows)
      for (let i = 0; i < lums.length; i++) lums[i] = luminance(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])
      const background = [...lums].sort((a, b) => a - b)[Math.floor(lums.length / 2)]

      cells = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          cells.push({
            x: offsetX + col * CELL + CELL / 2,
            y: offsetY + row * CELL + CELL / 2,
            ink: Math.min(1, Math.abs(lums[row * cols + col] - background) * 3.2),
            delay: Math.random() * SCATTER_MS,
          })
        }
      }
    }

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const cell of cells) {
        const progress = Math.min(1, Math.max(0, (elapsed - cell.delay) / (RESOLVE_MS - SCATTER_MS)))
        // Before resolving, a cell flickers as faint noise.
        const level = progress < 1 ? cell.ink * progress + Math.random() * 0.35 * (1 - progress) : cell.ink
        if (level < 0.06) {
          // The page itself shows as a faint grid of specks.
          ctx.globalAlpha = 0.12
          ctx.fillStyle = ink
          ctx.fillRect(cell.x - 0.5, cell.y - 0.5, 1, 1)
          continue
        }
        ctx.globalAlpha = 0.35 + level * 0.65
        ctx.fillStyle = level > 0.55 ? accent : ink
        ctx.beginPath()
        ctx.arc(cell.x, cell.y, 0.6 + level * (CELL / 2 - 0.6), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const tick = (now: number) => {
      if (cancelled) return
      if (!start) start = now
      const elapsed = now - start
      draw(elapsed)
      if (elapsed < RESOLVE_MS) raf = requestAnimationFrame(tick)
    }

    const render = (animate: boolean) => {
      layout()
      cancelAnimationFrame(raf)
      // "pause animation" (html.paused) skips the resolve, like reduced motion.
      const paused = document.documentElement.classList.contains("paused")
      if (animate && !reducedMotion && !paused) {
        start = 0
        raf = requestAnimationFrame(tick)
      } else {
        draw(Infinity)
      }
    }

    image.onload = () => !cancelled && render(true)
    image.src = src

    // Resizes redraw in place without replaying the reveal.
    const resize = new ResizeObserver(() => image.complete && render(false))
    resize.observe(wrap)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      resize.disconnect()
    }
  }, [src, resolvedTheme, reducedMotion])

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <canvas ref={canvasRef} role="img" aria-label={alt} className="absolute inset-0 size-full" />
    </div>
  )
}
