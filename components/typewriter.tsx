"use client"

import { useState, useEffect, startTransition } from "react"

interface TypewriterProps {
  text: string
  delay?: number
}

export function Typewriter({ text, delay = 100 }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  useEffect(() => {
    startTransition(() => {
      setDisplayedText("")
      setCurrentIndex(0)
    })
  }, [text])

  return <span>{displayedText}</span>
}
