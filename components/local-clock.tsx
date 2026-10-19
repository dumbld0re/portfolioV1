"use client"

import { useEffect, useState } from "react"

type Reading = { time: string; offset: string; place: string }

// The visitor's own wall-clock time, in whatever timezone their browser
// reports. Renders a placeholder on the server and first client paint (the
// server can't know the visitor's zone), so hydration never mismatches.
export function LocalClock({ className, showPlace = false }: { className?: string; showPlace?: boolean }) {
  const [reading, setReading] = useState<Reading | null>(null)

  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "shortOffset",
    })
    // "Europe/Berlin" → "Berlin", "America/Argentina/Buenos_Aires" → "Buenos Aires".
    const place = zone.split("/").pop()?.replace(/_/g, " ") ?? ""

    const tick = () => {
      const parts = formatter.formatToParts(new Date())
      const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ""
      setReading({
        time: `${get("hour")}:${get("minute")}:${get("second")}`,
        offset: get("timeZoneName"),
        place,
      })
    }
    const id = window.setInterval(tick, 1000)
    const first = window.setTimeout(tick, 0)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(first)
    }
  }, [])

  return (
    <span className={className} suppressHydrationWarning>
      <time className="tabular-nums">{reading?.time ?? "--:--:--"}</time>
      {reading && (
        <span className="text-muted-foreground">
          {" "}
          {reading.offset}
          {showPlace && reading.place && <span className="max-sm:hidden"> · {reading.place}</span>}
        </span>
      )}
    </span>
  )
}
