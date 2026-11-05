"use client"

import { useEffect, useState } from "react"

import { contactContent } from "@/content/contact"
import { useLanguage } from "@/components/language-provider"

/** Where I am. Every clock on this line is measured against it. */
const HOME = "Africa/Windhoek"
/** From this hour until LATE_UNTIL (my time), replies wait for tomorrow. */
const LATE_FROM = 22
const LATE_UNTIL = 7

/** A zone's UTC offset right now, in minutes. */
function offsetOf(zone: string) {
  const d = new Date()
  d.setSeconds(0, 0)
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  )
  const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute)
  return Math.round((wall - d.getTime()) / 60000)
}

type Reading = {
  mine: string
  yours: string
  /** The visitor's offset minus mine, in minutes. 0 means the same timezone. */
  gap: number
  /** My hour, 0–23. */
  hour: number
}

// My clock, the visitor's clock and how far apart they are. Zones are
// compared by UTC offset, so Johannesburg counts as the same timezone. When
// the visitor is elsewhere and it's past 22:00 here, a line says the reply
// will come tomorrow. Blank on the server and first paint: the server can't
// know the visitor's zone, so hydration never mismatches.
export function TimeStatus({ className }: { className?: string }) {
  const { language } = useLanguage()
  const t = contactContent[language].time
  const [r, setR] = useState<Reading | null>(null)

  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const clock = (timeZone: string) =>
      new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    const mineFmt = clock(HOME)
    const yoursFmt = clock(zone)

    // Local dev only: ?mytime=23:30 pretends it's that time in Windhoek (and
    // that the visitor is elsewhere), to preview the late note.
    const fake =
      process.env.NODE_ENV === "development"
        ? new URLSearchParams(window.location.search).get("mytime")?.match(/^(\d{1,2}):(\d{2})$/)
        : null

    const tick = () => {
      const now = new Date()
      const mine = fake ? `${fake[1].padStart(2, "0")}:${fake[2]}` : mineFmt.format(now)
      const gap = offsetOf(zone) - offsetOf(HOME)
      setR({
        mine,
        yours: yoursFmt.format(now),
        gap: fake && gap === 0 ? 60 : gap,
        hour: Number(mine.slice(0, 2)),
      })
    }
    const first = window.setTimeout(tick, 0)
    const id = window.setInterval(tick, 1000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(id)
    }
  }, [])

  const late = r && r.gap !== 0 && (r.hour >= LATE_FROM || r.hour < LATE_UNTIL)

  return (
    <div className={className} suppressHydrationWarning>
      <p>
        {t.mine} → <time className="tabular-nums text-foreground/80">{r?.mine ?? "--:--"}</time>
      </p>
      <p>
        {!r ? (
          <span aria-hidden="true">&nbsp;</span>
        ) : r.gap === 0 ? (
          t.same
        ) : (
          <>
            {t.yours} → <time className="tabular-nums text-foreground/80">{r.yours}</time> ({t.gap(r.gap)})
          </>
        )}
      </p>
      {late && (
        <p className="text-primary">
          <span aria-hidden="true">☾ </span>
          {r.hour >= LATE_FROM ? t.lateEvening : t.lateNight}
        </p>
      )}
    </div>
  )
}
