"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

// Tile travel distance in the bg-drift keyframes (globals.css) must equal this
// size, and the inner layer's negative inset must cover it, or the loop seams.
const TILE_SIZE = 240
const GLYPHS = [".", "·", "•"]
const GLYPH_DENSITY = 0.4

interface AsciiBackgroundProps {
  opacity?: number
  cellSize?: number
  className?: string
}

export function AsciiBackground({ opacity = 0.1, cellSize = 16, className }: AsciiBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tileUrl, setTileUrl] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const color = getComputedStyle(container).color
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const canvas = document.createElement("canvas")
    canvas.width = TILE_SIZE * dpr
    canvas.height = TILE_SIZE * dpr
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.scale(dpr, dpr)
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Glyphs stay inside their cells, so the pattern tiles seamlessly.
    const cells = Math.floor(TILE_SIZE / cellSize)
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        if (Math.random() > GLYPH_DENSITY) continue
        const size = cellSize * (0.5 + Math.random() * 0.4)
        ctx.font = `${Math.round(size)}px 'Geist Mono', ui-monospace, monospace`
        ctx.globalAlpha = 0.15 + Math.random() * 0.85
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ctx.fillText(glyph, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2)
      }
    }

    setTileUrl(canvas.toDataURL())
  }, [cellSize])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none print:hidden text-foreground [mask-image:radial-gradient(ellipse_130%_100%_at_50%_50%,black_40%,transparent_100%)]",
        className,
      )}
      style={{ opacity }}
    >
      {tileUrl && (
        <div
          className="absolute motion-safe:animate-bg-drift"
          style={{
            inset: -TILE_SIZE,
            backgroundImage: `url(${tileUrl})`,
            backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
          }}
        />
      )}
    </div>
  )
}
