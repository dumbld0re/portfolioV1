"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

import { Header } from "@/components/header"
import { ExperienceSection } from "@/components/sections/experience-section"
import { HomeSection } from "@/components/sections/home-section"
import * as loop from "@/lib/loop-store"
import { getLenis } from "@/lib/scroll"

// The home page never ends: below the contact section the top of the page
// comes round again (an inert echo of the header, hero and experience), and
// the moment the echo reaches the top of the screen the scroll quietly jumps
// back to the real top, which looks exactly the same. Scrolling up past the
// top does the opposite. The echo is longer than a screen on every width, so
// the jump always lands on matching content. Off in boring mode, behind a
// modal, and for anything else that holds the page still. Off until the ∞
// corner control (components/corner-controls.tsx) turns it on; while off
// there is no echo and the page ends at the footer.
export function PageLoop() {
  const echo = useRef<HTMLDivElement>(null)
  const on = useSyncExternalStore(loop.subscribe, loop.getSnapshot, loop.getServerSnapshot)

  useEffect(() => {
    const el = echo.current
    if (!el || !on) return
    const root = document.documentElement
    const held = () =>
      root.classList.contains("boring") || root.classList.contains("tl-html") || root.style.overflow === "hidden"

    // How far down the echo starts, measured from the top of the real page
    // (both sit in the same column, so offsetTop compares like with like).
    let period = 0
    const measure = () => {
      period = el.offsetTop
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (el.parentElement) ro.observe(el.parentElement)

    // Moves the page by a whole loop without a visible change. With Lenis on,
    // the glide still to come is kept: jump, then carry on the rest of the
    // way from the new spot, so a scroll in progress runs straight through.
    const shift = (by: number) => {
      const lenis = getLenis()
      if (lenis) {
        // Only a Lenis glide has a way still to go; a native scroll (touch,
        // keyboard, scrollbar) is wherever the browser says it is.
        const ahead = lenis.isScrolling === "smooth" ? lenis.targetScroll - lenis.animatedScroll : 0
        const at = window.scrollY + by
        lenis.scrollTo(at, { immediate: true, force: true })
        if (Math.abs(ahead) > 0.5) lenis.scrollTo(at + ahead, { force: true })
        return
      }
      window.scrollTo({ top: window.scrollY + by, behavior: "instant" })
    }

    const onScroll = () => {
      // Past the seam, not on it: an upward wrap lands exactly on it.
      if (period > 0 && !held() && window.scrollY > period) shift(-period)
    }

    // At the very top the browser has nowhere left to go, so an upward wheel
    // or swipe is caught first (capture, ahead of Lenis) and the page is
    // moved down to the echo, from where the scroll continues up as normal.
    const atTop = () => window.scrollY <= 1 && (getLenis()?.targetScroll ?? 0) <= 1
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 && period > 0 && !held() && atTop()) shift(period)
    }
    let touchY: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY
      if (touchY == null || y == null) return
      // a finger moving down the screen scrolls the page up
      if (y - touchY > 4 && period > 0 && !held() && atTop()) {
        shift(period)
        touchY = null
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("wheel", onWheel, { passive: true, capture: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("wheel", onWheel, { capture: true })
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
    }
  }, [on])

  if (!on) return null

  return (
    <div ref={echo} aria-hidden="true" inert className="print:hidden">
      <Header />
      <HomeSection echo />
      <ExperienceSection echo />
    </div>
  )
}
