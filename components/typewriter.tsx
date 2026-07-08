"use client"

import { useState, useEffect, useRef, startTransition } from "react"

interface TypewriterProps {
  text: string
  delay?: number
  startDelay?: number
  cursor?: boolean
  instant?: boolean
  onComplete?: () => void
}

export function Typewriter({
  text,
  delay = 100,
  startDelay = 0,
  cursor = true,
  instant = false,
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(startDelay === 0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const completedRef = useRef(false)

  const skip = instant || reducedMotion
  const done = skip || currentIndex >= text.length

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    completedRef.current = false
    startTransition(() => {
      setDisplayedText("")
      setCurrentIndex(0)
    })
  }, [text])

  useEffect(() => {
    if (startDelay === 0) return
    const timeout = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(timeout)
  }, [startDelay])

  useEffect(() => {
    if (!started && !skip) return

    if (!skip && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }

    if (!completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }, [started, skip, currentIndex, delay, text, onComplete])

  return (
    <span>
      <span aria-hidden="true">{skip ? text : displayedText}</span>
      <span className="sr-only">{text}</span>
      {cursor && (
        // Solid while typing, blinking once done — matches real terminal carets.
        <span aria-hidden="true" className={done ? "motion-safe:animate-caret-blink" : undefined}>
          ▍
        </span>
      )}
    </span>
  )
}
