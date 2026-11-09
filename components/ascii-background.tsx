"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// Tile travel distance in the bg-drift keyframes (globals.css) must equal this
// size, and the inner layer's negative inset must cover it, or the loop seams.
const TILE_SIZE = 240
/** Dot radii in px: a full stop, a middle dot, a bullet. */
const DOTS = [0.7, 0.95, 1.6]
const DOT_DENSITY = 0.4

interface AsciiBackgroundProps {
  cellSize?: number
  className?: string
}

// Faint on white (15%); stronger in dark mode (20%), where the same dots read weaker.
export function AsciiBackground({ cellSize = 16, className }: AsciiBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const tile = tileRef.current
    if (!container || !tile) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const canvas = document.createElement("canvas")
    canvas.width = TILE_SIZE * dpr
    canvas.height = TILE_SIZE * dpr
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.scale(dpr, dpr)
    // Drawn as a mask, not in color: the layer itself is filled with the
    // theme's text color, so the dots follow light/dark switches live instead
    // of keeping whatever color the page had when it loaded.
    ctx.fillStyle = "#fff"

    // Dots stay inside their cells, so the pattern tiles seamlessly. Drawn as
    // circles rather than font glyphs: every system renders them the same.
    const cells = Math.floor(TILE_SIZE / cellSize)
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        if (Math.random() > DOT_DENSITY) continue
        const radius = DOTS[Math.floor(Math.random() * DOTS.length)] * (0.85 + Math.random() * 0.3)
        ctx.globalAlpha = 0.15 + Math.random() * 0.85
        ctx.beginPath()
        ctx.arc(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Direct DOM mutation via ref, not React state — this is a one-time
    // imperative canvas draw, not an external value to keep in sync, so it
    // doesn't need (or want) a second render pass.
    const mask = `url(${canvas.toDataURL()})`
    tile.style.maskImage = mask
    tile.style.webkitMaskImage = mask
    // Only now that the mask exists may the layer show (see the style below).
    tile.style.opacity = "1"
  }, [cellSize])

  // Absolute rather than fixed, so the glyphs scroll with the page: Safari 26
  // tints its bars from fixed elements at the viewport edges in place of the
  // body background, and doesn't repaint that tint when their color changes,
  // leaving the bars stuck on the previous theme. Without one it follows the
  // body live. Page content sits above this layer at z-10.
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none print:hidden text-foreground opacity-15 dark:opacity-20",
        className,
      )}
    >
      <div
        ref={tileRef}
        className="bg-drift-layer absolute motion-safe:animate-bg-drift motion-safe:transition-opacity motion-safe:duration-700"
        style={{
          inset: -TILE_SIZE,
          backgroundColor: "currentColor",
          maskSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
          WebkitMaskSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
          maskRepeat: "repeat",
          WebkitMaskRepeat: "repeat",
          // Hidden until the effect has drawn the mask: unmasked, this layer is
          // a solid sheet of the text color at 15–20%, which tinted the whole
          // page grey for the first second or two of every load.
          opacity: 0,
        }}
      />
    </div>
  )
}
