"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type MouseEvent, type ReactNode } from "react"
import { createPortal } from "react-dom"

import { useLanguage } from "@/components/language-provider"
import { useMediaQuery } from "@/lib/use-media-query"

const OVERLAY_TEXT = "you clicked it."

// Timeline (ms) of the overlay before handing off to the route. The wipe
// finishes before the text lands; the text clears before the page swaps so the
// destination's own letter reveal takes over from an empty, inverted screen.
const WIPE_MS = 1100
const TEXT_IN_MS = 450
const TEXT_OUT_MS = 2300
const NAVIGATE_MS = 2600

/** Set on <html> for the hand-off so the body behind the entering page is already inverted. */
export const DONT_CLICK_CLASS = "dont-click-inverted"

export function DontClickLink({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter()
  const href = useLanguage().localize("/dont-click-here")
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const [textOut, setTextOut] = useState(false)

  useEffect(() => {
    router.prefetch(href)
  }, [router, href])

  useEffect(() => {
    if (!origin) return
    const timers = [
      setTimeout(() => setTextOut(true), TEXT_OUT_MS),
      setTimeout(() => {
        document.documentElement.classList.add(DONT_CLICK_CLASS)
        router.push(href)
      }, NAVIGATE_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [origin, router, href])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || origin) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    setOrigin({ x: event.clientX, y: event.clientY })
  }

  return (
    <>
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>
      {origin &&
        createPortal(
          <div
            aria-hidden="true"
            className="dont-click-wipe fixed inset-0 z-[9999] flex items-center justify-center bg-foreground text-background"
            style={
              {
                "--wipe-x": `${origin.x}px`,
                "--wipe-y": `${origin.y}px`,
                "--wipe-ms": `${WIPE_MS}ms`,
              } as React.CSSProperties
            }
          >
            <p
              className="font-serif text-4xl md:text-7xl tracking-tight transition-[opacity,filter,transform] duration-300 ease-out"
              style={textOut ? { opacity: 0, filter: "blur(12px)", transform: "scale(1.08)" } : undefined}
            >
              {OVERLAY_TEXT.split("").map((char, i) => (
                <span
                  key={i}
                  className="dont-click-letter inline-block whitespace-pre"
                  style={{ animationDelay: `${TEXT_IN_MS + i * 45}ms` }}
                >
                  {char}
                </span>
              ))}
            </p>
          </div>,
          document.body,
        )}
    </>
  )
}
