"use client"

import { useEffect, useRef, useState } from "react"

import type { Handwriting } from "@/content/handwriting"
import { cn } from "@/lib/utils"

/** Pen speed while writing, in the handwriting's own units per second. */
const SPEED = 1500
/** The pause while the pen lifts between strokes. */
const LIFT_MS = 70
/** The underlines are dashed off much faster than the words were written. */
const UNDERLINE_SPEED = 3600
/** A beat between finishing the words and starting to underline them. */
const UNDERLINE_PAUSE_MS = 280
/** Between underlines the pen barely leaves the paper. */
const UNDERLINE_LIFT_MS = 45

// Writes a traced piece of handwriting back in, stroke by stroke, the first
// time it scrolls into view. With motion paused or reduced it is simply there.
export function Handwritten({
  writing,
  label,
  className,
  delay = 0,
}: {
  writing: Handwriting
  /** What it says, for screen readers. */
  label: string
  className?: string
  /** Wait this long (ms) after it comes into view. */
  delay?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [write, setWrite] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setWrite(true)
        observer.disconnect()
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // When each stroke starts: after the ones before it, plus a pen lift.
  const timing = writing.strokes.reduce<{ start: number; duration: number }[]>((acc, stroke) => {
    const prev = acc[acc.length - 1]
    const start = prev ? prev.start + prev.duration + LIFT_MS : delay
    return [...acc, { start, duration: (stroke.length / SPEED) * 1000 }]
  }, [])
  const written = timing.length ? timing[timing.length - 1].start + timing[timing.length - 1].duration : delay

  // Then the underlines, back and forth, one straight after the other.
  const underlineTiming = (writing.underlines ?? []).reduce<{ start: number; duration: number }[]>((acc, line) => {
    const prev = acc[acc.length - 1]
    const start = prev ? prev.start + prev.duration + UNDERLINE_LIFT_MS : written + UNDERLINE_PAUSE_MS
    return [...acc, { start, duration: (line.length / UNDERLINE_SPEED) * 1000 }]
  }, [])

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={label}
      viewBox={`0 0 ${writing.width} ${writing.height}`}
      data-write={write ? "" : undefined}
      className={cn("handwritten overflow-visible", className)}
    >
      {writing.strokes.map((stroke, i) => {
        const { start, duration } = timing[i]
        return (
          <path
            key={i}
            d={stroke.d}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={writing.pen}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animationDuration: `${duration}ms`, animationDelay: `${start}ms` }}
          />
        )
      })}
      {writing.underlines?.map((line, i) => {
        const { start, duration } = underlineTiming[i]
        return (
          <path
            key={`u${i}`}
            d={line.d}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={writing.pen * 0.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="handwritten-underline"
            style={{ animationDuration: `${duration}ms`, animationDelay: `${start}ms` }}
          />
        )
      })}
    </svg>
  )
}
