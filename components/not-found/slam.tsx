"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

import { HomeLink } from "@/components/not-found/home-link"
import { motionOff } from "@/lib/eggs"

const serif = "font-serif lowercase leading-none tracking-[-0.04em]"

/** Rings the dot ground out in amber (components/dot-ground.tsx). */
const pulse = () => {
  window.dispatchEvent(new Event("dots:pulse"))
}

/* The 404 page ---------------------------------------------------------------
   A 404 as wide as the screen drops from above and hits the floor: it
   squashes, the page shakes, the dot ground rings out in amber. Click it
   and it does it again. */
export function NotFoundSlam() {
  const root = useRef<HTMLDivElement>(null)
  const big = useRef<HTMLHeadingElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const el = big.current
    const page = root.current
    if (!el || !page) return
    const ctx = gsap.context(() => {
      const digits = el.querySelectorAll("[data-d]")
      tl.current = gsap
        .timeline({ paused: motionOff(), delay: 0.3 })
        .from(digits, { yPercent: -260, duration: 0.55, ease: "power4.in", stagger: 0.12 })
        .call(pulse, [], "-=0.05")
        .to(digits, { scaleY: 0.72, scaleX: 1.12, transformOrigin: "50% 100%", duration: 0.08, stagger: 0.12 }, "<-0.24")
        .to(digits, { scaleY: 1, scaleX: 1, duration: 0.9, ease: "elastic.out(1.2, 0.3)", stagger: 0.12 }, "<0.08")
        .fromTo(page, { x: 0, y: 0 }, { keyframes: { x: [-14, 12, -9, 6, -3, 0], y: [8, -6, 4, -2, 0] }, duration: 0.45, ease: "none" }, "<-0.06")
        .from("[data-rest]", { autoAlpha: 0, y: 24, duration: 0.5, stagger: 0.08, ease: "power3.out" }, "-=0.4")
    }, page)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="w-full">
      <h1
        ref={big}
        onClick={() => tl.current?.restart()}
        className={`${serif} -ml-[0.04em] cursor-pointer select-none text-[clamp(9rem,38vw,34rem)]`}
        aria-label="404"
      >
        {["4", "0", "4"].map((d, i) => (
          <span key={i} data-d className="inline-block">
            {d}
          </span>
        ))}
        <span data-d className="inline-block text-primary">
          .
        </span>
      </h1>
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-6">
        <p data-rest className="font-serif text-3xl lowercase md:text-5xl">
          no such file or directory.
        </p>
        <span data-rest>
          <HomeLink />
        </span>
      </div>
    </div>
  )
}
