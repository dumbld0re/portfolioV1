"use client"

import { useEffect, useId, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import { siteCopy } from "@/content/site"

// The footer can render twice on one page (contact section + site footer), so
// every instance shares a single request: one visit, one count.
let request: Promise<number | null> | null = null

function fetchViews() {
  request ??= fetch("/api/views", { method: "POST" })
    .then((res) => (res.ok ? res.json() : { views: null }))
    .then(({ views }: { views: number | null }) => views)
    .catch(() => null)
  return request
}

/** " | <eye> 1,204": all-time count of unique devices, shown after "last updated". */
export function ViewCount() {
  const { language } = useLanguage()
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    let live = true
    fetchViews().then((n) => live && setViews(n))
    return () => {
      live = false
    }
  }, [])

  if (views === null) return null
  const count = views.toLocaleString(language === "de" ? "de-DE" : "en-US")
  return (
    <span className="whitespace-nowrap">
      <span aria-hidden="true" className="mx-2 opacity-50">|</span>
      <span className="inline-flex items-center gap-1.5 align-middle" title={`${count} ${siteCopy[language].visitors}`}>
        <BlinkingEye />
        <span>{count}</span>
        <span className="sr-only">{siteCopy[language].visitors}</span>
      </span>
    </span>
  )
}

/** Hairline almond eye with a drawn iris: it glances left and right, blinks,
 *  and now and then blinks twice. Motion lives in globals.css (.eye-mark). */
function BlinkingEye() {
  const clip = `eye-lid-${useId().replace(/:/g, "")}`
  return (
    <svg viewBox="0 0 24 14" aria-hidden="true" className="eye-mark h-[0.85em] w-[1.45em] overflow-visible">
      <defs>
        <clipPath id={clip}>
          <path d="M1 7C6 .5 18 .5 23 7 18 13.5 6 13.5 1 7Z" />
        </clipPath>
      </defs>
      <g className="eye-mark-lid">
        <path
          d="M1 7C6 .5 18 .5 23 7 18 13.5 6 13.5 1 7Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        <g clipPath={`url(#${clip})`}>
          <g className="eye-mark-iris">
            <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <circle cx="12" cy="7" r="1.9" fill="currentColor" />
            <circle cx="13.1" cy="5.9" r="0.55" className="fill-background" />
          </g>
        </g>
      </g>
    </svg>
  )
}
